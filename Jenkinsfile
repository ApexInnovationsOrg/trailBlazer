#!/usr/bin/env groovy

pipeline {

    agent {
        docker {
            image 'node'
            args '-u root'
        }
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'npm config rm proxy'
                sh 'npm config rm https-proxy'
                sh 'npm install --verbose'
            }
        }
    }
}
