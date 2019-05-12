#!groovy

@Library('blockr-jenkins-lib') _

String repo = 'blockr-crypto'

Map settings = [
    sonar_key: 'blockr-crypto',
    skip_tests: false,
    source_folder: 'src/',
    archive_folders: ['dist/']
]

tsBuildAndPublish(repo, settings)