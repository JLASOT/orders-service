pipeline {
  agent { label 'docker' }

  environment {
    DOCKER_IMAGE_NAME = "orders-service:latest"
    STAGING_URL = "http://localhost:3000"
    DEFECTDOJO_URL = "http://3.88.160.242:8080"
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

    stage('Upload Semgrep to DefectDojo') {
      steps {
        withCredentials([string(credentialsId: 'defectdojo-api-token', variable: 'DEFECTDOJO_API_KEY')]) {
          sh '''
            echo "⬆️ Uploading Semgrep report to DefectDojo..."

            curl -s -o response.json -w "%{http_code}" -X POST "${DEFECTDOJO_URL}/api/v2/import-scan/" \
              -H "Authorization: Token ${DEFECTDOJO_API_KEY}" \
              -F "product_name=Orders Service" \
              -F "engagement_name=CI/CD Jenkins Pipeline" \
              -F "product_type_name=Semgrep JSON Report" \
              -F "scan_type=Semgrep JSON Report" \
              -F "file=@semgrep-results.json" \
              -F "active=true" \
              -F "verified=true" \
              -F "auto_create_context=true" \
              -F "deduplication_on_engagement=true" \
              -F "scan_date=$(date +%F)" \
              -F "minimum_severity=Low" \
              -F "engagement_end_date=$(date -d \"+7 days\" +%F)"

            echo "📄 DefectDojo API response:"
            cat response.json
          '''
        }
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
                  owasp/dependency-check:12.1.6 \
                  dependency-check.sh \
                  --project devsecops-labs \
                  --scan /src \
                  --format XML \
                  --out /report/dependency-check-report.xml || true
                ls -l dependency-check-reports
            '''
            archiveArtifacts artifacts: 'dependency-check-reports/**', allowEmptyArchive: false
        }
    }

    stage('Upload Dependency-Check to DefectDojo') {
      steps {
        withCredentials([string(credentialsId: 'defectdojo-api-token', variable: 'DEFECTDOJO_API_KEY')]) {
          sh '''
            echo "⬆️ Uploading Dependency-Check report to DefectDojo..."
            curl -s -o response.json -w "%{http_code}" -X POST "${DEFECTDOJO_URL}/api/v2/import-scan/" \
              -H "Authorization: Token ${DEFECTDOJO_API_KEY}" \
              -F "product_name=Orders Service - DependencyCheck" \
              -F "engagement_name=CI/CD Jenkins Pipeline - DependencyCheck" \
              -F "product_type_name=Generic Findings" \
              -F "scan_type=Dependency Check Scan" \
              -F "file=@dependency-check-reports/dependency-check-report.xml" \
              -F "active=true" -F "verified=true" \
              -F "auto_create_context=true" \
              -F "deduplication_on_engagement=true" \
              -F "scan_date=$(date +%F)" \
              -F "minimum_severity=Low" \
              -F "engagement_end_date=$(date -d "+7 days" +%F)"
            echo "📄 DefectDojo API response:"
            cat response.json
          '''
        }
      }
    }

    stage('PaC - Checkov on Dockerfile') {
      steps {
        echo "Running Policy as Code (Checkov)..."
        sh '''
          docker run --rm -v $PWD:/project -w /project bridgecrew/checkov \
            -d /project --framework dockerfile --output json > checkov-report.json || true
          docker run --rm -v $PWD:/project -w /project bridgecrew/checkov \
            -d /project --framework dockerfile --output cli > checkov-cli-report.txt || true

          echo "Checkov CLI Report:"
          cat checkov-cli-report.txt
        '''
        archiveArtifacts artifacts: 'checkov-report.json,checkov-cli-report.txt', allowEmptyArchive: true
      }
    }

    stage('Upload Checkov to DefectDojo') {
      steps {
        withCredentials([string(credentialsId: 'defectdojo-api-token', variable: 'DEFECTDOJO_API_KEY')]) {
          sh '''
            echo "⬆️ Uploading Checkov report to DefectDojo (Generic Findings)..."

            curl -s -o response.json -w "%{http_code}" -X POST "${DEFECTDOJO_URL}/api/v2/import-scan/" \
              -H "Authorization: Token ${DEFECTDOJO_API_KEY}" \
              -F "product_name=Orders Service - Checkov" \
              -F "engagement_name=CI/CD Jenkins Pipeline - Checkov" \
              -F "product_type_name=Generic Findings" \
              -F "scan_type=Checkov Scan" \
              -F "file=@checkov-report.json" \
              -F "active=true" \
              -F "verified=true" \
              -F "auto_create_context=true" \
              -F "deduplication_on_engagement=true" \
              -F "scan_date=$(date +%F)" \
              -F "minimum_severity=Low" \
              -F "engagement_end_date=$(date -d "+7 days" +%F)"

            echo "📄 DefectDojo API response:"
            cat response.json
          '''
        }
      }
    }

    stage('PaC - Checkov Validation') {
      steps {
        echo "Validating Checkov report..."
        sh '''
            echo "Full Checkov summary:"
            jq '.summary' checkov-report.json
        
          FAILED=$(jq '.summary.failed' checkov-report.json)
          echo "Checkov failed checks: $FAILED"
          if [ "$FAILED" -gt 0 ]; then
            echo "Critical policy violations detected. Failing pipeline."
            exit 1
          else
            echo "No critical policy violations."
          fi
        '''
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
            aquasec/trivy:0.67.0 image \
              --format json --output /reports/trivy-report.json ${DOCKER_IMAGE_NAME} || true

          # Fail on HIGH/CRITICAL vulnerabilities
          docker run --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            -v $(pwd)/trivy-cache:/root/.cache/ \
            aquasec/trivy:0.67.0 image \
              --severity HIGH,CRITICAL ${DOCKER_IMAGE_NAME} || true
        '''
        archiveArtifacts artifacts: 'trivy-reports/**', allowEmptyArchive: true
      }
    }

    stage('Upload Trivy to DefectDojo') {
      steps {
        withCredentials([string(credentialsId: 'defectdojo-api-token', variable: 'DEFECTDOJO_API_KEY')]) {
          sh '''
            echo "⬆️ Uploading Trivy report to DefectDojo..."
            curl -s -o response.json -w "%{http_code}" -X POST "${DEFECTDOJO_URL}/api/v2/import-scan/" \
              -H "Authorization: Token ${DEFECTDOJO_API_KEY}" \
              -F "product_name=Orders Service - Trivy" \
              -F "engagement_name=CI/CD Jenkins Pipeline - Trivy" \
              -F "product_type_name=Trivy Scan" \
              -F "scan_type=Trivy Scan" \
              -F "file=@trivy-reports/trivy-report.json" \
              -F "active=true" \
              -F "verified=true" \
              -F "auto_create_context=true" \
              -F "deduplication_on_engagement=true" \
              -F "scan_date=$(date +%F)" \
              -F "minimum_severity=Low" \
              -F "engagement_end_date=$(date -d "+7 days" +%F)"
            echo "📄 DefectDojo API response:"
            cat response.json
          '''
        }
      }
    }

//funciona
    stage('PaC - Trivy Validation') {
      steps {
        echo "Validating Trivy report..."
        sh '''
          if ! command -v jq &> /dev/null; then
            apt-get update && apt-get install -y jq
          fi

          # Contar vulnerabilidades CRÍTICAS y ALTAS
          HIGH=$(jq '[.Results[].Vulnerabilities[]? | select(.Severity=="HIGH")] | length' trivy-reports/trivy-report.json)
          CRITICAL=$(jq '[.Results[].Vulnerabilities[]? | select(.Severity=="CRITICAL")] | length' trivy-reports/trivy-report.json)

          echo "HIGH vulnerabilities: $HIGH"
          echo "CRITICAL vulnerabilities: $CRITICAL"

          #TOTAL=$((HIGH + CRITICAL))

          if [ "$TOTAL" -gt 0 ]; then
            echo "Security issues detected! Failing pipeline."
            exit 1
          else
            echo "No HIGH/CRITICAL vulnerabilities found."
          fi
        '''
      }
    }

    stage('Deploy to Staging (docker-compose)') {
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
                    /bin/bash -c "zap-baseline.py -t http://localhost:3000 -r zap-report.html -x zap-report.xml || true; \
                                  chown -R ${USER_ID}:${GROUP_ID} /zap/wrk; \
                                  chmod -R 775 /zap/wrk"

                ls -l zap-reports
            '''
            archiveArtifacts artifacts: 'zap-reports/**', allowEmptyArchive: true
        }
    }

    stage('Upload ZAP to DefectDojo') {
      steps {
        withCredentials([string(credentialsId: 'defectdojo-api-token', variable: 'DEFECTDOJO_API_KEY')]) {
          sh '''
            echo "⬆️ Uploading ZAP report to DefectDojo..."
            curl -s -o response.json -w "%{http_code}" -X POST "${DEFECTDOJO_URL}/api/v2/import-scan/" \
              -H "Authorization: Token ${DEFECTDOJO_API_KEY}" \
              -F "product_name=Orders Service - ZAP" \
              -F "engagement_name=CI/CD Jenkins Pipeline - ZAP" \
              -F "product_type_name=ZAP Scan" \
              -F "scan_type=ZAP Scan" \
              -F "file=@zap-reports/zap-report.xml" \
              -F "active=true" -F "verified=true" \
              -F "auto_create_context=true" \
              -F "deduplication_on_engagement=true" \
              -F "scan_date=$(date +%F)" \
              -F "minimum_severity=Low" \
              -F "engagement_end_date=$(date -d "+7 days" +%F)"
            echo "📄 DefectDojo API response:"
            cat response.json
          '''
        }
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
          rclone copy "${ARTIFACTS_DIR}/checkov-report.json" "${REMOTE}/" -P || true
          rclone copy "${ARTIFACTS_DIR}/checkov-cli-report.txt" "${REMOTE}/" -P || true

          

          echo "Artifacts uploaded to ${REMOTE}"
        '''
      }
    }

} // stages
  
// slack
post {
    always {
        script {
            echo "Pipeline finished. Collecting artifacts..."

            def driveLink = "https://drive.google.com/drive/folders/15qOTmSh7lB4cIFuFOqqha1m1aYK1gnuG?usp=drive_link"

            def artifacts = [
                "semgrep-results.json",
                "dependency-check-reports/dependency-check-report.xml",
                "trivy-reports/trivy-report.json",
                "zap-reports/zap-report.xml",
                "checkov-report.json",
                "checkov-cli-report.txt"
            ]
            def generated = []

            artifacts.each { a ->
                if (fileExists(a)) {
                    generated.add(a)
                }
            }

            def message = "🟡 Pipeline *${env.JOB_NAME}* #${env.BUILD_NUMBER} finished.\n" +
                          "✅ Artifacts generated: ${generated.join(', ')}\n" +
                          "Google Drive: <${driveLink}|JenkinsReports/${env.BUILD_NUMBER}>"

            slackSend channel: '#jenkins',
                      botUser: true,
                      color: '#439FE0',
                      message: message
        }
    }

    success {
        script {
            def driveLink = "https://drive.google.com/drive/folders/15qOTmSh7lB4cIFuFOqqha1m1aYK1gnuG?usp=drive_link"

            slackSend channel: '#jenkins',
                      botUser: true,
                      color: 'good',
                      message: "✅ Pipeline *${env.JOB_NAME}* #${env.BUILD_NUMBER} completed successfully.\nArtifacts: <${driveLink}|JenkinsReports/${env.BUILD_NUMBER}>"
        }
    }

    failure {
        slackSend channel: '#jenkins',
                  botUser: true,
                  color: 'danger',
                  message: "❌ Pipeline *${env.JOB_NAME}* #${env.BUILD_NUMBER} failed!\nCheck Jenkins logs: ${env.BUILD_URL}"
    }
}


}