/* global angular,window */
var imobDbApp = angular.module('imobDbApp', ['angular-gestures', 
                                              'ngRoute', 
                                              'ngResource',
                                              'imobDbControllers', 
                                              'imobDbFilters', 
                                              'imobDbServices', 
                                              'imobDbDirectives',
                                              'loginDbControllers',                                               
                                              'calcController', 
                                              'calendarDbControllers', 
                                              'syncDbControllers', 
                                              'dropzone']);

 
var dropzone = angular.module('dropzone', []);
var imobDbControllers = angular.module('imobDbControllers', ['ui.bootstrap', 'ngResource', 'ngAnimate', 'xc.indexedDB']);
var imobDbFilters = angular.module('imobDbFilters', []);
var imobDbServices = angular.module('imobDbServices', []);
var imobDbDirectives = angular.module('imobDbDirectives', []);
var loginDbControllers = angular.module('loginDbControllers', []);
var calcController = angular.module('calcController', []);
var calendarDbControllers = angular.module('calendarDbControllers', ['ui.calendar', 'ui.bootstrap', 'ngDraggable', 'ngAnimate', 'xc.indexedDB']);
var syncDbControllers = angular.module('syncDbControllers', ['ui.bootstrap', 'ngAnimate', 'xc.indexedDB']);


var options = {};
options.api = {};
options.api.base_url = "http://localhost";
options.api.msgs = {"nottosync":{text:"Não há informações para sincronizar",type:"info"},
                    "syncing":{text:"Aguarde, estamos em sincronização com o servidor!!",type:"warning"},
                    "failtosync":{text:"Falha na sincronização com o servidor!!",type:"danger"},
                    "finalsync":{text:"Sincronização finalizada",type:"success"}
                   };

imobDbApp.config(['$routeProvider', '$locationProvider', 'hammerDefaultOptsProvider',
	function($routeProvider , $locationProvider, hammerDefaultOptsProvider)
	{			
		$routeProvider.
		  when('/', {
				templateUrl: '/partials/home.html',
				controller: 'HomeCtrl',	
				access: { requiredAuthentication: true }
			}).
      when('/upload', {
        templateUrl: '/partials/login.html',
        controller: 'AdminUserCtrl',
        css: '/css/login.css'
      }).
      when('/login', {
        templateUrl: '/partials/login.html',
        controller: 'AdminUserCtrl',
        css: '/css/login.css'
      }).
      when('/logout', {
          templateUrl: '/partials/logout.html',
          controller: 'AdminUserCtrl',
          access: { requiredAuthentication: true  }
      }).
      when('/sync', {
				templateUrl: '/partials/sync.html',
				controller: 'syncCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/biblioteca', {  
				templateUrl: 'partials/biblioteca.html',
				//controller: 'BibliotecaCtrl',
				controller: 'HomeCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/clientes', { 
				templateUrl: '/partials/listViewClientes.html',
				controller: 'ClientesCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/clientes/new', {  
				templateUrl: '/partials/formNewClientes.html',
				controller: 'ClientesEditCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/clientes/edit/:id', { 
				templateUrl: '/partials/formNewClientes.html',
				controller: 'ClientesEditCtrl',	
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/imoveis', { 
				templateUrl: '/partials/listViewImoveis.html',
				controller: 'ImoveisCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/imoveis/new', {  
				templateUrl: '/partials/formNewImoveis.html',
				controller: 'ImoveisEditCtrl',
				access: { requiredAuthentication: true }	
			}).
			when('/cadastro/imoveis/edit/:id', {
				templateUrl: '/partials/formNewImoveis.html',
				controller: 'ImoveisEditCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/contratos', { 
				templateUrl: '/partials/listViewContratos.html',
				controller: 'ContratosCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/contratos/new', {  
				templateUrl: '/partials/formNewContratos.html',
				controller: 'ContratosEditCtrl',
				access: { requiredAuthentication: true }			
			}).
			when('/cadastro/contratos/edit/:id', {
				templateUrl: '/partials/formNewContratos.html',
				controller: 'ContratosEditCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/eventos', { 
				templateUrl: '/partials/listViewEventos.html',
				controller: 'EventosCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/eventos/new', {  
				templateUrl: '/partials/formNewEventos.html',
				controller: 'EventosEditCtrl',
				access: { requiredAuthentication: true }	
			}).
			when('/cadastro/eventos/edit/:id', {
				templateUrl: '/partials/formNewEventos.html',
				controller: 'EventosEditCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/dashboard', {  
				templateUrl: '/partials/home.html',
				controller: 'ClientesCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/calendario', {  
				templateUrl: 'partials/calendario.html',
				controller: 'CalendarCtrl',
				css: '/css/calendar.css',
				access: { requiredAuthentication: true }
			}).
			when('/calculadoras/emprestimo', {  
				templateUrl: 'partials/calculadoraEmprestimo.html',
				controller: 'calculadoraCtrl',
				access: { requiredAuthentication: false }
			}).						
			when('/unsupported', {
				templateUrl: '/partials/unsupported.html'
			}).
			when('/404', {
				templateUrl: 'partials/404.html',
				css: '/css/404.css',
				access: { requiredAuthentication: false }
			}).
			otherwise({
				access: { requiredAuthentication: true }
			});
			
		$locationProvider.html5Mode(true);
		hammerDefaultOptsProvider.set({
        recognizers: [[Hammer.Tap, {time: 100}]]
    });		
	
		//$controllerProvider.register('HomeCtrl', function($scope)
		//{
		    
		//});
	
	}
]);

imobDbApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

imobDbApp.run(function($rootScope, $location, $window, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
         if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication 
            && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
            $rootScope.hidemenu = true;
            $location.path("/login").replace();            
        }
        
        if (nextRoute.access.requiredAuthentication 
            && AuthenticationService.isAuthenticated 
            && $window.sessionStorage.token){        
            $rootScope.hidemenu = false;
            options.api.equipid = $window.sessionStorage.equipid;
        }
    });    
});
