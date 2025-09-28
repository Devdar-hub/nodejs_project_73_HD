pipeline {
  agent any

  tools {
    nodejs "newNodeJS"  
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/Devdar-hub/nodejs_project_73_HD'
      }
    }

    stage('Build') {
      steps {
        sh '''
          echo "Installing dependencies..."
          npm ci
          echo "Building project..."
          npm run build
          # Save build artifact
          tar -czf build-artifact.tar.gz dist/
        '''
        archiveArtifacts artifacts: 'build-artifact.tar.gz'
      }
    }

    stage('Test') {
      steps {
        sh '''
          echo "Running unit tests..."
          export TEST_PORT=5000
          npm test
        '''
        junit 'reports/junit/results.xml'
      }
    }

    stage('Code Quality') {
      steps {
        withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
          sh '''
            echo "Running ESLint..."
            npx eslint '**/*.ts' || true

            echo "Running SonarQube Scan..."
            sonar-scanner \
              -Dsonar.projectKey=Devdar-hub_nodejs_project_73_HD \
              -Dsonar.organization=devdar-hub \
              -Dsonar.sources=src \
              -Dsonar.host.url=https://sonarcloud.io \
              -Dsonar.token=$SONAR_TOKEN
          '''
        }
      }
    }

    stage('Security') {
      steps {
        sh '''
          echo "Running npm audit..."
          npm audit --json > audit-report.json || true

          echo "Running Trivy scan on project folder..."
          if ! command -v trivy >/dev/null 2>&1; then
            curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh
            chmod +x ./bin/trivy
            TRIVY=./bin/trivy
          else
            TRIVY=$(command -v trivy)
          fi

          $TRIVY fs --exit-code 0 --severity HIGH,CRITICAL --format json -o trivy-report.json .
        '''
        archiveArtifacts artifacts: '*.json', allowEmptyArchive: true
      }
    }

    // stage('Deploy to Staging') {
    //   steps {
    //     script {
    //       echo "Deploying application to staging via Octopus Deploy..."
    //       withCredentials([string(credentialsId: 'OCTOPUS_API_KEY', variable: 'OCTOPUS_API_KEY')]) {
    //         sh """
    //           octo deploy-release \\
    //             --server https://deakin-assignment-753.octopus.app \\
    //             --apiKey $OCTOPUS_API_KEY \\
    //             --project "deakin-jenkins-project" \\
    //             --deployTo "Staging"
    //         """
    //       }
    //     }
    //   }
    // }

  } // end of stages

  post {
    always {
      echo "Pipeline finished (check test, quality, and security reports)."
    }
  }

}
