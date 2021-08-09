# Project Checklist

Delete each item when it's completed or if it's not relevant to this project.

Delete this file after all steps have been completed.

## GitHub

* Create GitHub repository
* Grant `Azavea Developers` "Admin" access to repository (Setting > Collaborators & teams)
* Determine project LICENSE

## Source Code

* Copy "Civic Apps App Template" contents
    ```sh
    git clone --depth=1 git@github.com:azavea/civic-apps-app-template.git actual-vegishphilly
    cd actual-vegishphilly
    TEMPLATE_SHA=$(git rev-parse --short HEAD)
    rm -rf .git
    ```
* Replace references to `Project Name` in the `README`
* Edit italicized sections of the `README` to be specific to the project.
* Replace references to `vegishphilly` in `Vagrantfile`, `Jenkinsfile`, `docker-compose.yml`, and `src/app/package.json`
    ```sh
    # MacOS
    grep -srlp vegishphilly * | xargs sed -i .bak 's/project-name/actual-project-name/'; find . -name "*.bak" -delete
    # Linux
    grep -srl vegishphilly * | xargs sed -i.bak 's/project-name/actual-project-name/'; find . -name "*.bak" -delete
    ```
* Replace references to `vegishphilly_` in `scripts` and `deployment`
    ```sh
    # MacOS
    grep -srlp vegishphilly * | xargs sed -i .bak 's/project_name/actual_project_name/'; find . -name "*.bak" -delete
    # Linux
    grep -srl vegishphilly * | xargs sed -i.bak 's/project_name/actual_project_name/'; find . -name "*.bak" -delete
    ```
* Replace references to `${VEGISHPHILLY_...}` in `scripts` and `deployment`
    ```sh
    # MacOS
    grep -srlp VEGISHPHILLY * | xargs sed -i .bak 's/PROJECT_NAME/ACTUAL_PROJECT_NAME/'; find . -name "*.bak" -delete
    # Linux
    grep -srl VEGISHPHILLY * | xargs sed -i.bak 's/PROJECT_NAME/ACTUAL_PROJECT_NAME/'; find . -name "*.bak" -delete
    ```
* Rename files containing `vegishphilly` in `deployment/ansible`
    ```sh
    find . -name "*vegishphilly*" -print0 | xargs -0 -n1 bash -c 'mv "$0" "${0/project-name/actual-project-name}"'
    ```
* Pick a port number and replace the placeholder one (`4567`) in `README.md`, `Vagrantfile`, and `docker-compose.yml`
* Commit the modified template code:
    ```sh
    git init
    git add .
    git commit -m "Import app template at $TEMPLATE_SHA"
    git remote add origin git@github.com:azavea/actual-vegishphilly.git
    git push -u origin master
    git checkout -b develop
    git push -u origin develop
    ```

### GitHub Branch Policy

* Make `develop` the default branch
* Make `develop` and `master` branches protected

## Design Prototype

* Verify that prototype works in all browsers we intend to support
* Convert prototype to React
* Archive static prototype assets (skip this step if prototype was created in React)
  * Push `prototype` branch to upstream repository

## Project Management

* Add project to ZenHub

## Continuous Integration

* Setup PR builder (Travis CI, Jenkins, etc.)
  * Execute the `cibuild.sh` command
* Verify that `lint.sh` and `test.sh` commands work

## Staging Deployments

* Create IAM role
* Obtain credentials
  * SSH key
  * AWS credentials
* Update deployment scripts (`cibuild.sh`, Terraform, etc.)
* Setup Jenkins to deploy from the `develop` branch
  * Execute the `cipublish.sh` command

## Production Deployments

* Create IAM role
* Obtain credentials
  * SSH key
  * AWS credentials
* Update deployment scripts (`cibuild.sh`, Terraform, etc.)
* Setup Jenkins to deploy from the `master` branch
  * Execute the `cipublish.sh` command

## HTTP Services

* Expose `version.txt` endpoint

## Python packages

* Include version number in `setup.py`
* Setup Python debug logging
