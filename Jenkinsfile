#!/usr/bin/env groovy

pipeline {
    agent any
    stages {
        stage('Install package') { 
            steps {
                sh 'npm install' 
            }
        }
        stage('Build Package'){
            steps {
                sh 'npm run build'
            }   
        }
        stage('Push to staging'){
            steps{
               sh 'rsync -avz build/* bwhite@app4.apexinnovations.com:~/apexwebtest/admin/trailBlazer'
            }
        }
    }
    post{
        always{
            slackSend (color: '#00FF00', message: 'Build Completed')
        }
    }
}