#!/usr/bin/env groovy
//@Library('bitwiseman-shared@blog/declarative/notifications') _

pipeline {
    agent any
    stages {    
        stage('Start'){
            steps{
                rocketSend message: "Build for Trailblazer Started", channel: 'jenkins'
            }
        }	
        stage('Install package') { 
            steps {
                sh 'npm install .' 
            }
        }
        stage('Build Package'){
            steps {
                sh 'npm run build'
            }   
        }
        stage('Push to staging'){
            steps{
                sh 'rsync -avz --no-perms --no-owner --no-group ./* bitnami@apexwebtest.apexinnovations.com:/apex/htdocs'
            }
        }
    }
	post {
        success{
            rocketSend message: "Build for trailblazer great success! (●´ω｀●)",emoji:':dab:', channel: 'jenkins'
        }
        unstable{
            rocketSend message: "Build for trailblazer unstable (∩︵∩)", channel: 'jenkins'
        }
        failure{
            rocketSend message: "I have failed for trailblazer senpai ಥ_ಥ", channel: 'jenkins'
        }
    }
}