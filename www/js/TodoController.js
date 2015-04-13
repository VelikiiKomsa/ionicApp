(function (app) {

    
     app.factory('ProjectFactory',function(){
    
        function removeTask(task){
            var _this = this;
              _this.tasks.some(function(elem,index){
                            if(task.title === elem.title){
                                _this.tasks.splice(index,1);
                                return true;
                            }
         });
        }
            
         
        return{
            all: function(){
                var projectString = localStorage['projects'];
                if(projectString){
                    return angular.fromJson(projectString);
                }
                return [];
            },
            save: function(projects){
                window.localStorage['projects'] = angular.toJson(projects);
            },
            newProject: function(projectTitle){
                var project = {
                    title: projectTitle,
                    tasks: []
                }
                
                project.removeTask = removeTask.bind(project);
                return project;
                
            },
            removeTaskFromProject: function(project,task){
                project.tasks.some(function(elem,index){
                    if(elem.title === task.title){
                        project.tasks.splice(index,1);
                        return true;
                    }
                });
            },
            
            getLastActiveIndex: function(){
                return parseInt(window.localStorage['lastActiveProject']) || 0;
            },
            setLastActiveIndex: function(index){
                window.localStorage['lastActiveProject'] = index;
            }
        };
    });

    
    app.controller('TodoController', ['$scope','$ionicModal','$ionicSideMenuDelegate','$timeout','ProjectFactory',function ($scope, $ionicModal, $ionicSideMenuDelegate,$timeout,ProjectFactory) {

        $ionicSideMenuDelegate.toggleLeft(true);
        
        var vm = this;
        vm.task = {};
        
        function createProject(projectTitle) {
            var newProject = ProjectFactory.newProject(projectTitle);
            vm.projects.push(newProject);
            ProjectFactory.save(vm.projects);
            vm.selectProject(newProject, vm.projects.length - 1);
        }

        vm.projects = ProjectFactory.all();

        vm.activeProject = vm.projects[ProjectFactory.getLastActiveIndex()];

        vm.newProject = function () {
            var projectTitle = prompt('Project name');

            if (projectTitle) {
                createProject(projectTitle);
            }
        };


        vm.selectProject = function (project, index) {
            vm.activeProject = project;
            ProjectFactory.setLastActiveIndex(index);
            $ionicSideMenuDelegate.toggleLeft(false);
        };

        $ionicModal.fromTemplateUrl('templates/newTask.html', {
            scope: $scope
        }).then(function setModal(modal) {
            vm.taskModal = modal;
        });
        
           vm.createTask = function (task) {
        if (!vm.activeProject || !task) {
            return;
        }
        vm.activeProject.tasks.push({
            title: task.title
        });
        vm.taskModal.hide();

        // Inefficient, but save all the projects
        ProjectFactory.save(vm.projects);

        task.title = "";
    };

    vm.newTask = function () {
        vm.taskModal.show();
    };
        
    vm.removeTask = function(task){
       
        ProjectFactory.removeTaskFromProject(vm.activeProject,task);
        
    };    

    vm.closeNewTask = function () {
        vm.taskModal.hide();
    }

    vm.toggleProjects = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    
    $timeout(function() {
    if(vm.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title');
        if(projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });
       

    }]);

 

})(angular.module('starter', ['ionic']));