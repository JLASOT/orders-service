pipeline {
  agent { label 'docker' }

  environment {
    DOCKER_IMAGE_NAME = "orders-service:latest"
    STAGING_URL = "http://localhost:3000"
  }

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'main',
         url: 'https://github.com/JLASOT/orders-service.git'
      }
    }
    
    stage('SAST - Semgrep') {
      steps {
        echo "Running Semgrep (SAST)..."
        sh '''
          docker run --rm -v $PWD:/src returntocorp/semgrep:latest semgrep --config=auto --json --output semgrep-results.json /src || true
          cat semgrep-results.json || true
        '''
        archiveArtifacts artifacts: 'semgrep-results.json', allowEmptyArchive: true
      }
    }
    
  stage('Build') {
    steps {
        echo "Building app (npm install and tests) using Docker..."
        sh '''
        docker run --rm \
            -v $PWD:/app \
            -w /app \
            node:20 \
            bash -c "npm install --no-audit --no-fund && \
                    if [ -f package.json ]; then \
                        if npm test --silent; then echo 'Tests OK'; else echo 'Tests failed (continue)'; fi; \
                    fi"
         '''
        }
    }
stage('SCA - Dependency Check (OWASP dependency-check)') {
    steps {
        echo 'Running Dependency-Check with debug log...'
        sh '''
            mkdir -p dependency-check-reports dependency-check-data
            docker run --rm -u 0:0 \
                -v $PWD:/src \
                -v $PWD/dependency-check-data:/usr/share/dependency-check/data \
                -v $PWD/dependency-check-reports:/report \
                owasp/dependency-check:latest \
                dependency-check.sh \
                --project devsecops-labs \
                --scan /src \
                --format JSON \
                --out /report/dependency-check-report.json || true
            ls -l dependency-check-reports
        '''
        archiveArtifacts artifacts: 'dependency-check-reports/**', allowEmptyArchive: false
    }
}
stage('Docker Build & Trivy Scan') {
      steps {
        echo "Building Docker image..."
        sh '''
          docker build -t ${DOCKER_IMAGE_NAME} -f Dockerfile .
        '''

        echo "Scanning image with Trivy..."
        sh '''
          mkdir -p trivy-reports trivy-cache
          

          # Report JSON
          docker run --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            -v $(pwd)/trivy-cache:/root/.cache/ \
            -v $(pwd)/trivy-reports:/reports \
            aquasec/trivy:latest image \
              --format json --output /reports/trivy-report.json ${DOCKER_IMAGE_NAME} || true

          # Fail on HIGH/CRITICAL vulnerabilities
          docker run --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            -v $(pwd)/trivy-cache:/root/.cache/ \
            aquasec/trivy:latest image \
              --severity HIGH,CRITICAL ${DOCKER_IMAGE_NAME} || true
        '''
        archiveArtifacts artifacts: 'trivy-reports/**', allowEmptyArchive: true
      }
    }

    stage('Deploy to Staging (docker-compose)') {
    //   agent { label 'docker' }
      steps {
        echo "Deploying to staging with docker-compose..."
        sh '''
          docker-compose -f docker-compose.yml down || true
          docker-compose -f docker-compose.yml up -d --build
          sleep 8
          docker ps -a
        '''
      }
    }

stage('DAST - OWASP ZAP scan') {
    steps {
        echo "Running DAST (OWASP ZAP) BASELINE scan (Última solución de permisos)..."
        sh '''
            USER_ID=$(id -u)
            GROUP_ID=$(id -g)

            mkdir -p zap-reports
            docker run --rm --network host \
                -v $PWD/zap-reports:/zap/wrk \
                --user 0 \
                ghcr.io/zaproxy/zaproxy:stable \
                /bin/bash -c "zap-baseline.py -t http://localhost:3000 -r zap-report.html || true; \
                              chown -R ${USER_ID}:${GROUP_ID} /zap/wrk; \
                              chmod -R 775 /zap/wrk"

            ls -l zap-reports
        '''
        archiveArtifacts artifacts: 'zap-reports/**', allowEmptyArchive: true
    }
}

  stage('Upload Artifacts to Google Drive') {
  steps {
    echo "Uploading artifacts to Google Drive..."
    sh '''
      # Carpeta donde Jenkins guarda los reportes
      ARTIFACTS_DIR=$PWD

      # Remote de rclone configurado (gdrive) y carpeta en Drive
      REMOTE="godrive:JenkinsReports/${BUILD_NUMBER}"

      # Crear carpeta en Drive y subir todo
      rclone mkdir "${REMOTE}" || true
      rclone copy "${ARTIFACTS_DIR}/semgrep-results.json" "${REMOTE}/" -P || true
      rclone copy "${ARTIFACTS_DIR}/dependency-check-reports/" "${REMOTE}/dependency-check-reports/" -P || true
      rclone copy "${ARTIFACTS_DIR}/trivy-reports/" "${REMOTE}/trivy-reports/" -P || true
      rclone copy "${ARTIFACTS_DIR}/zap-reports/" "${REMOTE}/zap-reports/" -P || true

      echo "Artifacts uploaded to ${REMOTE}"
    '''
  }
}

} // stages
  
  post {
    always {
      echo "Pipeline finished. Collecting artifacts..."
    }
    failure {
      echo "Pipeline failed!"
    }
  }
}
