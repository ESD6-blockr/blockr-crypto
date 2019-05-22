#!groovy

@Library('blockr-jenkins-lib') _

String repo = 'blockr-crypto'

Map settings = [
    sonar_key: 'blockr-crypto',
    sonar_exclusions: '**/**/index.ts,**/__tests__/**/*',
    source_folder: 'src/',
    archive_folders: ['dist/']
]

tsBuildAndPublish(repo, settings)