#!/usr/bin/env groovy
//@Library('bitwiseman-shared@blog/declarative/notifications') _

pipeline {
    agent any
    stages {
        stage('Prepare environment') {
            steps {
                sh "/var/lib/jenkins/scripts/prepenv.sh"
                sh "ls -lha .env"
            }
        }        
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
}