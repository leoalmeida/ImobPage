/* global angular */

'use strict';

var myVersion = 7;
var key = {
			backspace: 8,
			enter: 13,
			escape: 27,
			left: 37,
			up: 38,
			right: 39,
			down: 40,
			comma: 188
		};
var OBJECT_STORE_CLIENTES = 'cliente';
var OBJECT_STORE_EVENTOS = 'evento';
var OBJECT_STORE_IMOVEIS = 'imovel';
var OBJECT_STORE_CONTRATOS = 'contrato';
var OBJECT_STORE_DOCUMENTOS = 'documento';
var OBJECT_STORE_TIPODOC = 'tipoDocumento';

imoveisDbControllers.config(function ($indexedDBProvider) {
	$indexedDBProvider
      .connection('imobapp-localdb')
      .upgradeDatabase(myVersion, function(event, db, tx){
      		if(!db.objectStoreNames.contains(OBJECT_STORE_TIPODOC)) {
      			var osTipoDocumentos = db.createObjectStore(OBJECT_STORE_TIPODOC, { keyPath: "tipo" });
      			osTipoDocumentos.createIndex("formato_idx", "tipo", { unique: false });
      		}
      		if(!db.objectStoreNames.contains(OBJECT_STORE_CONTRATOS)) {
            var osContratos = db.createObjectStore(OBJECT_STORE_CONTRATOS, { keyPath: "id", autoIncrement:true });
            osContratos.createIndex("cpfLocador_idx", "cpfLocador", { unique: false , multientry: true });
            osContratos.createIndex("lastsyncdate_idx", "lastsyncdate", { unique: false });
          }
      		if(!db.objectStoreNames.contains(OBJECT_STORE_IMOVEIS)) {
            var osImoveis = db.createObjectStore(OBJECT_STORE_IMOVEIS, { keyPath: "id", autoIncrement:true });
            osImoveis.createIndex("cpfLocador_idx", "cpfLocador", { unique: false});
            osImoveis.createIndex("cpfLocatario_idx", "cpfLocatario", { unique: false });
            osImoveis.createIndex("bairro_idx","bairro", 	{unique:false});
            osImoveis.createIndex("lastsyncdate_idx", "lastsyncdate", { unique: false });
          }
          if(!db.objectStoreNames.contains(OBJECT_STORE_CLIENTES)) {
            var osLocatarios = db.createObjectStore(OBJECT_STORE_CLIENTES, { keyPath: "cpf"});
            osLocatarios.createIndex("cpf_idx", "cpfCliente", { unique: false });	
            osLocatarios.createIndex("tipo_idx", "tipo", { unique: false, multientry: true });			
            osLocatarios.createIndex("doc_idx", "docs", { unique: false, multientry: true });
            osLocatarios.createIndex("lastsyncdate_idx", "lastsyncdate", { unique: false });
          }
          if(!db.objectStoreNames.contains(OBJECT_STORE_EVENTOS)) {
            var osEventos = db.createObjectStore(OBJECT_STORE_EVENTOS, { keyPath: "id", autoIncrement:true });
            osEventos.createIndex("idContrato_idx", "idContrato", { unique: false });
            osEventos.createIndex("tipoEvento_idx", "tipoEvento", { unique: false });
            osEventos.createIndex("acaoEvento_idx", "acaoEvento", { unique: false });
            osEventos.createIndex("lastsyncdate_idx", "lastsyncdate", { unique: false });
          }
          
          /**
          * @type {ObjectStore} TIPOS DE DOCUMENTOS
          */
		      if(!db.objectStoreNames.contains(OBJECT_STORE_TIPODOC)) {
		          var osDocumentos = db.createObjectStore(OBJECT_STORE_TIPODOC, { keyPath: "id", autoIncrement:true });
              
		          /*
		          $http.get('/api/doctypes').
                  success(function(data, status, headers, config) {                      
                    osDocumentos
                    .insert =
                    data.posts;
                  });
		          */
              osDocumentos
                .insert({	
                  tipo: 'PDF',
                  icon: "fa-file-pdf-o"
                    });
              osDocumentos 
                .insert({
                  tipo: 'TXT',
                  icon: "fa-file-text-o"
                    });
              osDocumentos 
                .insert({
                  tipo: 'Excel',
                  icon: "fa-file-excel-o"				
                    });
              osDocumentos 
                .insert({
                  tipo: 'CSV',
                  icon: "fa-file-excel-o"
                    });
              osDocumentos 
                .insert({
                  tipo: 'Vídeo',
                  icon: "fa-file-video-o"				
                    });
              osDocumentos 
                .insert({
                  tipo: 'IMG',
                  icon: "fa-file-image-o"				
                    });
              osDocumentos 
                .insert({
                  tipo: 'SOM',
                  icon: "fa-file-sound-o"				
                    });
              osDocumentos 
                .insert({
                  tipo: 'DOC',
                  icon: "fa-file-word-o"				                                                              
                    });	
          }
      });       
});

imoveisDbControllers.controller('HomeCtrl', ['$scope', '$indexedDB', 'PostService', 
		function($scope,  $indexedDB,  PostService ) {	
	$scope.filesubmit = function(){
	  //if($scope.endereco.cep) return '';	    
	    var teste = PostService.publishDocs($scope.docItem).then(function(response) {	        
	        $scope.fileuploadMSG = "File Sent";          
      });
 	};
 	
	/*$scope.editPost = function () {
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };*/
  
	/*Dropzone.options = {
	  url: "/syncs/file-upload",
    previewTemplate: document.querySelector('#preview-template').innerHTML,
    // Specifing an event as an configuration option overwrites the default
    // `addedfile` event handler.
    addedfile: function(file) {
      file.previewElement = Dropzone.createElement(this.options.previewTemplate);
      // Now attach this new element some where in your page
    },
    thumbnail: function(file, dataUrl) {
      // Display the image in your file.previewElement
    },
    uploadprogress: function(file, progress, bytesSent) {
      // Display the progress
    },
    acceptedFiles: "image/*,application/pdf",
    addRemoveLinks: "dictCancelUploadConfirmation"
  };*/
	
	//var myDropzone = new Dropzone("div#dropzone", Dropzone.options);
	
	/**
	* @type Contratos
	*/
	var contratosObjectStore = $indexedDB.objectStore(OBJECT_STORE_CONTRATOS);
	var documentosObjectStore = $indexedDB.objectStore(OBJECT_STORE_TIPODOC);
	
	
	
  function buscaContratos() {
		contratosObjectStore.getAll().then(function(contratosList) {  
		//persistanceService.buscaImoveis().then(function(imoveisList) {
			$scope.listViewContratos = contratosList;
		});		
	}
	
	/**
	* @type Eventos
	*/
	var eventosObjectStore = $indexedDB.objectStore(OBJECT_STORE_EVENTOS);
	
  function buscaEventos() {
		eventosObjectStore.getAll().then(function(eventosList) {  
		//persistanceService.buscaImoveis().then(function(imoveisList) {
			$scope.listViewEventos = eventosList;
		});		
	}	
	
	$scope.setMaster = function(section) {
	    $scope.selected = section;
	};
	
	function enviaDocumentos() {
        eventosObjectStore.getAll().then(function(itemsList) {
            var objtype = "docs";
            var objtags = "Documentos";
            
            $scope.msgInformativa = options.api.msgs.syncing;
            $scope.showDetalhes = false;
            
            var publishItem = {
                    type: objtype,
                    subtype: value.tipo,
                    title: value.titulo,
                    tags: objtags,
                    is_published: true,                        
                    content: JSON.stringify(value)                                                
            };
              
            PostService.publishdocs(publishItem).success(function(data) {
                console.log(data.status);
                console.log(data.statusMessage);
                console.log(data.content);
                $scope.syncedItems
                $scope.syncedItems.push(data.content);
                $scope.syncedQtd++;
                $scope.percDone = 100*$scope.syncedQtd/$scope.syncSize;
                if ($scope.percDone == 100) {
                    $scope.msgInformativa = options.api.msgs.finalsync;
                }
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });                               
            });
            console.log(status);
            console.log("Documento enviado");        	
  }
  
	if($indexedDB.onDatabaseError) {
		$location.path('/unsupported');
	} else {
		  buscaContratos();
		  buscaEventos();		  
	}
			
}]);

imoveisDbControllers.controller('ClientesCtrl', ['$scope', '$indexedDB', 
		function($scope,  $indexedDB) {
	
	$scope.objects = [];
	$scope.entidade = "Clientes";
	$scope.formatosSelecionados = [];	
	 	
	var documentosObjectStore = $indexedDB.objectStore(OBJECT_STORE_TIPODOC);
	documentosObjectStore.getAll().then(function(typeList) { 
		$scope.tipoDocList = typeList;
	});
	
	
	//init();
	
	/**
	* @type {ObjectStore}
	*/
	var clientesObjectStore = $indexedDB.objectStore(OBJECT_STORE_CLIENTES);
	
	
	
    	function buscaClientes() {
		clientesObjectStore.getAll().then(function(clientesList) {  
		//persistanceService.buscaImoveis().then(function(imoveisList) {
			$scope.listView = clientesList;
		});		
	}
	
	$scope.setSelectedDocTypes = function () {
		var tipo = this.tipoDoc.tipo;
		if (_.contains($scope.formatosSelecionados, tipo)) {
		    $scope.formatosSelecionados = _.without($scope.formatosSelecionados, tipo);
		} else {
		    $scope.formatosSelecionados.push(tipo);
		}
		return false;
	};
	
	$scope.isChecked = function (id) {
		if (_.contains($scope.formatosSelecionados, id)) {
		    return 'fa fa-check pull-right';
		}
		return false;
	};
	
	$scope.checkAll = function () {
		$scope.formatosSelecionados = _.pluck($scope.tipoDocList, 'tipo');
	};
	
	$scope.setMaster = function(section) {
	    $scope.selected = section;
	};
	
	$scope.isSelected = function(section) {
	    return $scope.selected === section;
	};
		
	
	$scope.removeCliente = function(key) {
		clientesObjectStore.delete(key).then(function() {			
			buscaLocadores();
		});
	};
	
	if($indexedDB.onDatabaseError) {
		$location.path('/unsupported');
	} else {
		buscaClientes();
	}

}]);

imoveisDbControllers.controller('ClientesEditCtrl', ['$scope', '$log', '$rootScope', '$routeParams', '$location',  '$indexedDB', '$filter', 'cepService', 
		function($scope, $log, $rootScope, $routeParams, $location, $indexedDB, $filter, cepService) {
		
	if ($routeParams.type === "edit") {$scope.entidade = "Alterar Cliente";}
	else {$scope.entidade = "Incluir Cliente";}
	/**
	* @type {ObjectStore}
	*/
		
	$scope.tiposClientes = [{text:"Proprietário", value:"proprietario"}, {text:"Locatário", value:"locatario"}, {text:"Fiador", value:"fiador"}];
	$scope.tiposTelefones = [{text:"Residencial", value:"residencial"}, {text:"Celular", value:"celular"}, {text:"Comercial", value:"comercial"}, {text:"Adicional", value:"adicional"}];
	$scope.tiposEnderecos = [{text:"Residencial", value:"residencial"}, {text:"Comercial", value:"comercial"},{text:"Adicional", value:"adicional"}];
	$scope.tiposImoveis = [{text:"Casa",value:"casa"},{text:"Apartamento",value:"apartamento"},{text:"Conjugado",value:"conjugado"},{text:"Comercial",value:"comercial"},{text:"Loja",value:"loja"}];
	
	
	$scope.novocliente = {};
	$scope.endereco = {};
	$scope.telefone = {};
	$scope.documentos = [];
	$scope.novocliente.tipoCliente = [];
	$scope.novocliente.enderecos = [];	
	$scope.novocliente.telefones = [];	
	$scope.novocliente.documentos = [];
		
	var clientesObjectStore = $indexedDB.objectStore(OBJECT_STORE_CLIENTES);
	
	$scope.incluirEndereco = function(){
      $scope.novocliente.enderecos.push($scope.endereco);
      $scope.endereco = {};
	};

	$scope.removeEndereco = function(index){
		  $scope.novocliente.enderecos.splice(index, 1);		
	};
	
	$scope.incluirTelefone = function(){
	    //if (tapButton !== key.enter) return;
	   
	    if ($scope.telefone.numero !== '' && $scope.telefone.tipo !== ''){
          $scope.novocliente.telefones.push($scope.telefone);
          $scope.telefone = {};          
      }
	};
	
	$scope.removeTelefone = function(index){
	    $scope.novocliente.telefones.splice(index, 1);
	};
	
	$scope.cancel = function() {
			
	};
	    
	$scope.getCEP = function(){
	  //if($scope.endereco.cep) return '';	    
	    var teste = cepService.get($scope.endereco.cep).then(function(response) {	        
	        $scope.endereco.rua = response.data.logradouro;
          $scope.endereco.bairro = response.data.bairro;
          $scope.endereco.cidade = response.data.localidade;      
          $scope.endereco.uf = response.data.uf;
          $scope.endereco.pais = "Brasil"
      });
 	};
	
	$scope.submit = function() {
      
      $scope.novocliente.updated = $filter('dateFormat')(new Date(),false);
      
      if ($routeParams.type !== "edit"){
          $scope.novocliente.created = $filter('dateFormat')(new Date(),false);
          $scope.novocliente.synced = null;
      }
            
      clientesObjectStore
      .upsert($scope.novocliente)
      .then(function(e){
          $log.info('Cliente' + $scope.novocliente.nome + 'included with CPF:'+  $scope.novocliente.cpf +  ' at:' + new Date());
          $location.path("/cadastro/clientes").replace();
      });
		
	};
	
	function buscaInfo() {		
		if($routeParams.id) {
			var myQuery = $indexedDB.queryBuilder().$eq($routeParams.id).$asc().compile();
			clientesObjectStore.each(
				function(cliente){
				      
					/*angular.forEach(cliente.value.tipoCliente, function(key, value) {
					   if (this.value.situacao) {
					      if (value.tipo==="proprietario"){$scope.proprietario.active};
					      if (value.tipo==="locatario"){$scope.locatario.active};
					      if (value.tipo==="fiador"){$scope.fiador.active};
					   }
          });*/
          
          $scope.novocliente.cpf = cliente.value.cpf;
					$scope.novocliente.nome = cliente.value.nome;
					$scope.novocliente.email = cliente.value.email;
					$scope.novocliente.tipoCliente = cliente.value.tipoCliente;
					$scope.novocliente.telefones = cliente.value.telefones;
					$scope.novocliente.enderecos = cliente.value.enderecos;
				}
			,myQuery);
		}
	}
		
	
	
	if($indexedDB.onDatabaseError) {
		$location.path('/unsupported');
	} else {
		buscaInfo();
	}
	
}]);

imoveisDbControllers.controller('ImoveisCtrl', ['$scope', '$indexedDB',
		function($scope,  $indexedDB) {

	
	$scope.objects = [];
	$scope.entidade = "Imóveis";
	$scope.formatosSelecionados = [];
	
	var documentosObjectStore = $indexedDB.objectStore(OBJECT_STORE_TIPODOC);
	documentosObjectStore.getAll().then(function(typeList) { 
		$scope.tipoDocList = typeList;
	});
	
	
	/**
	* @type {ObjectStore}
	*/
	var imoveisObjectStore = $indexedDB.objectStore(OBJECT_STORE_IMOVEIS);
	
	
	
  function buscaImoveis() {
		imoveisObjectStore.getAll().then(function(imoveisList) {  
		//persistanceService.buscaImoveis().then(function(imoveisList) {
			$scope.listView = imoveisList;
		});		
	}	
	
	$scope.setSelectedDocTypes = function () {
		var tipo = this.tipoDoc.tipo;
		if (_.contains($scope.formatosSelecionados, tipo)) {
		    $scope.formatosSelecionados = _.without($scope.formatosSelecionados, tipo);
		} else {
		    $scope.formatosSelecionados.push(tipo);
		}
		return false;
	};
	
	$scope.isChecked = function (id) {
		if (_.contains($scope.formatosSelecionados, id)) {
		    return 'fa fa-check pull-right';
		}
		return false;
	};
	
	$scope.checkAll = function () {
		$scope.formatosSelecionados = _.pluck($scope.tipoDocList, 'tipo');
	};
	
	  
	$scope.setMaster = function(section) {
	    $scope.selected = section;
	};
	
	$scope.isSelected = function(section) {
	    return $scope.selected === section;
	};
		
	
	$scope.removeImovel = function(key) {
		imoveisObjectStore.delete(key).then(function() {			
			buscaImoveis();
		});
	};
	
	if($indexedDB.onDatabaseError) {
		$location.path('/unsupported');
	} else {
		buscaImoveis();
	}
			
}]);


imoveisDbControllers.controller('ImoveisEditCtrl', ['$scope', '$log', '$rootScope', '$routeParams', '$location',  '$indexedDB', '$filter','cepService',
    function($scope, $log, $rootScope, $routeParams, $location, $indexedDB, $filter, cepService) {
      
    if ($routeParams.type === "edit") {$scope.entidade = "Alterar Imóvel";}
    else {$scope.entidade = "Incluir Imóvel";}
    /**
    * @type {ObjectStore}
    */
    var imoveisObjectStore = $indexedDB.objectStore(OBJECT_STORE_IMOVEIS);
    var clientesObjectStore = $indexedDB.objectStore(OBJECT_STORE_CLIENTES);
    
    $scope.novoimovel = {};
    $scope.novoimovel.proprietarios = [];
    $scope.novoimovel.documentos = [];
    $scope.proprietario = {};
    
    $scope.tiposImoveis = [{text:"Casa",value:"casa"},{text:"Apartamento",value:"apartamento"},{text:"Conjugado",value:"conjugado"},{text:"Comercial",value:"comercial"},{text:"Loja",value:"loja"}];
    $scope.tiposSituacao = [{text:"À Liberar",value:"aliberar"},{text:"Liberado",value:"liberado"},{text:"Indisponível",value:"indisponivel"}];    
    $scope.tiposProprietarios = [{text:"Principal",value:"principal"},{text:"Adicional",value:"adicional"}];
    
    
    $scope.today= function() {
        $scope.dt = new Date();
    };
    
    $scope.today();
    
    $scope.incluirProprietario = function(){        
        if ($scope.proprietario.identificador !== ''){
            $scope.novoimovel.proprietarios.push($scope.proprietario.obj);
            $scope.proprietario = {};
        }
    };
    
    $scope.removeProprietario = function(index){
        $scope.novoimovel.proprietarios.splice(index, 1);
    };
    
    $scope.getCEP = function(){
	  //if($scope.endereco.cep) return '';	    
	    var teste = cepService.get($scope.novoimovel.endereco.cep).then(function(response) {	        
	        $scope.novoimovel.endereco.rua = response.data.logradouro;
          $scope.novoimovel.endereco.bairro = response.data.bairro;
          $scope.novoimovel.endereco.cidade = response.data.localidade;      
          $scope.novoimovel.endereco.uf = response.data.uf;
          $scope.novoimovel.endereco.pais = "Brasil"
      });
    };
    
    function buscarClientes(){
          clientesObjectStore.getAll().then(function(itemsList) {
            $scope.itemsList = itemsList;
          });
    }
      
    $scope.cancel = function() {
        
    };
  
    $scope.submit = function() {
        
        $scope.novoimovel.updated = $filter('dateFormat')(new Date(),false);
        
        if ($routeParams.type !== "edit"){
            $scope.novoimovel.created = $filter('dateFormat')(new Date(),false);
            $scope.novoimovel.synced = null;
        }
       
        //alert($filter('json')($scope.novoimovel));
        
        imoveisObjectStore
          .upsert($scope.novoimovel)
              .then(function(e){
                   $log.info('Evento' + $scope.novoimovel.id + 'incluído em:'+  $scope.novoimovel.updated +  ' at:' + new Date());
                   $location.path('/cadastro/imoveis').replace();
        });
      
    };    
    function buscaInfo() {		
        if($routeParams.id) {
          var myQuery = $indexedDB.queryBuilder().$eq(Number($routeParams.id)).$asc().compile();
          imoveisObjectStore.each(
            function(imovel){
                  
              /*angular.forEach(cliente.value.tipoCliente, function(key, value) {
                 if (this.value.situacao) {
                    if (value.tipo==="proprietario"){$scope.proprietario.active};
                    if (value.tipo==="locatario"){$scope.locatario.active};
                    if (value.tipo==="fiador"){$scope.fiador.active};
                 }
              });*/
              
              $scope.novoimovel.id = imovel.value.id;              
              $scope.novoimovel.descricao = imovel.value.descricao;
              $scope.novoimovel.titulo = imovel.value.titulo;
              $scope.novoimovel.proprietarios = imovel.value.proprietarios;
              $scope.novoimovel.tipoImovel = imovel.value.tipoImovel;
              $scope.novoimovel.tipoSituacao = imovel.value.tipoSituacao;
              $scope.novoimovel.endereco = imovel.value.endereco;
              $scope.novoimovel.documentos = imovel.value.documentos;
            }
          ,myQuery);
        }
    }
    
  
  
    if($indexedDB.onDatabaseError) {
      $location.path('/unsupported');
    } else {      
      buscaInfo();
      buscarClientes();      
    }
			
}]);

imoveisDbControllers.controller('ContratosCtrl', ['$scope', '$indexedDB',
		function($scope,  $indexedDB) {

	
	$scope.objects = [];
	$scope.entidade = "Contratos";
	$scope.formatosSelecionados = [];
	
	var documentosObjectStore = $indexedDB.objectStore(OBJECT_STORE_TIPODOC);
	documentosObjectStore.getAll().then(function(typeList) { 
		$scope.tipoDocList = typeList;
	});
	
	
	/**
	* @type {ObjectStore}
	*/
	var contratosObjectStore = $indexedDB.objectStore(OBJECT_STORE_CONTRATOS);
	
	
	
  function buscaContratos() {
		contratosObjectStore.getAll().then(function(contratosList) {  
		//persistanceService.buscaImoveis().then(function(imoveisList) {
			$scope.listView = contratosList;
		});		
	}
	
	$scope.setSelectedDocTypes = function () {
		var tipo = this.tipoDoc.tipo;
		if (_.contains($scope.formatosSelecionados, tipo)) {
		    $scope.formatosSelecionados = _.without($scope.formatosSelecionados, tipo);
		} else {
		    $scope.formatosSelecionados.push(tipo);
		}
		return false;
	};
	
	$scope.isChecked = function (id) {
		if (_.contains($scope.formatosSelecionados, id)) {
		    return 'fa fa-check pull-right';
		}
		return false;
	};
	
	$scope.checkAll = function () {
		$scope.formatosSelecionados = _.pluck($scope.tipoDocList, 'tipo');
	};
	
	  
	$scope.setMaster = function(section) {
	    $scope.selected = section;
	};
	
	$scope.isSelected = function(section) {
	    return $scope.selected === section;
	};
		
	
	$scope.removeContrato = function(key) {
		contratosObjectStore.delete(key).then(function() {			
			buscaContratos();
		});
	};
	
	if($indexedDB.onDatabaseError) {
		$location.path('/unsupported');
	} else {
		buscaContratos();
	}

			
}]);

imoveisDbControllers.controller('ContratosEditCtrl', ['$scope', '$log', '$rootScope', '$routeParams', '$location',  '$indexedDB', '$filter',
    function($scope, $log, $rootScope, $routeParams, $location, $indexedDB, $filter) {
      
    if ($routeParams.type === "edit") {$scope.entidade = "Alterar Contrato";}
    else {$scope.entidade = "Incluir Contrato";}
    /**
    * @type {ObjectStore}
    */
    var contratosObjectStore = $indexedDB.objectStore(OBJECT_STORE_CONTRATOS);    
    var clientesObjectStore = $indexedDB.objectStore(OBJECT_STORE_CLIENTES);    
    var imoveisObjectStore = $indexedDB.objectStore(OBJECT_STORE_IMOVEIS);
    
    $scope.novocontrato = {};
    $scope.locatario = {};
    $scope.fiador = {};
    $scope.imovel = {};
    $scope.novocontrato.imovel = {};
    $scope.novocontrato.locatarios = [];
    $scope.novocontrato.fiadores = [];
    
    //$scope.relacao = {};
    $scope.tiposContrato = [{text:"Locação",value:"locacao"},{text:"Administração",value:"administracao"},{text:"Venda",value:"venda"}];
    $scope.tiposSituacao = [{text:"Ativo",value:"ativo"},{text:"À Vencer",value:"avencer"},{text:"Vencido",value:"vencido"},{text:"Finalizado",value:"finalizado"}];    
    $scope.novocontrato.situacao = "ativo";
    
    $scope.today= function() {
        $scope.dt = new Date();
    };
    
    $scope.today();
    
    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.dateOptions = {
        formatDay: 'dd',
        formatMonth: 'MM',
        formatYear: 'yyyy',
        startingDay: 1
    };
    
    $scope.incluirLocatario = function(){
        if ($scope.locatario !== ''){
            $scope.novocontrato.locatarios.push($scope.locatario.obj);
            $scope.locatario = {};
        }
    };
    
    $scope.removeLocatario = function(index){
        $scope.novocontrato.locatarios.splice(index, 1);
    };
        
    $scope.incluirFiador = function(){
        if ($scope.fiador !== ''){
            $scope.novocontrato.fiadores.push($scope.fiador.obj);
            $scope.fiador = {};
        }
    };
    
    $scope.removeFiador = function(index){
        $scope.novocontrato.fiadores.splice(index, 1);
    };
    
    function buscarClientes(){    
        clientesObjectStore.getAll().then(function(itemsList) {
            $scope.clientesList = itemsList;
        });
    }
    
    function buscarImoveis(){
         imoveisObjectStore.getAll().then(function(itemsList) {
            $scope.imoveisList = itemsList;
         });		
    }
    
    $scope.cancel = function() {
        
    };
  
    $scope.submit = function() {
        
        $scope.novocontrato.updated = $filter('dateFormat')(new Date(),false);
        
        if ($routeParams.type !== "edit"){
            $scope.novocontrato.created = $filter('dateFormat')(new Date(),false);
            $scope.novocontrato.synced = null;
        }
        
        $scope.novocontrato.situacao = "pendente";       
        
        $scope.novocontrato.dataInicio = $filter('dateFormat')($scope.novocontrato.updated, true);
        $scope.novocontrato.dataVencimento = $filter('dateFormat')($scope.picker, true);
        
        $scope.novocontrato.imovel = $scope.imovel.obj;   
        
        //alert($filter('json')($scope.novocontrato));
        
        contratosObjectStore
          .upsert($scope.novocontrato)
              .then(function(e){
                   $log.info('Evento' + $scope.novocontrato.id + 'incluído com vencimento em:'+  $scope.novocontrato.dataVencimento +  ' at:' + new Date());
                   $location.path('/cadastro/contratos').replace();
        });
      
    };
	
    function buscaInfo() {
        if($routeParams.id) {
          var myQuery = $indexedDB.queryBuilder().$eq(Number($routeParams.id)).$asc().compile();
          contratosObjectStore.each(
            function(contrato){
              
              $scope.novocontrato.id = contrato.value.id;
              $scope.novocontrato.dataInicio = contrato.value.dataInicio;              
              $scope.novocontrato.dataVencimento = contrato.value.dataVencimento;
              $scope.novocontrato.imovel = contrato.value.imovel;
              $scope.novocontrato.fiadores = contrato.value.fiadores;
              $scope.novocontrato.locadores = contrato.value.locadores;
              $scope.novocontrato.locatarios = contrato.value.locatarios;
              $scope.novocontrato.situacao = contrato.value.situacao;
              $scope.novocontrato.tipoContrato = contrato.value.tipoContrato
              $scope.novocontrato.documentos = contrato.value.documentos;
            }
          ,myQuery);
        }
    }
    
    if($indexedDB.onDatabaseError) {
      $location.path('/unsupported');
    } else {
      buscaInfo();
      buscarClientes();
      buscarImoveis();
    }
			
}]);

imoveisDbControllers.controller('EventosCtrl', ['$scope', '$indexedDB',
		function($scope,  $indexedDB) {

	
	$scope.entidade = "Eventos";
	
	/**
	* @type {ObjectStore}
	*/
	var eventosObjectStore = $indexedDB.objectStore(OBJECT_STORE_EVENTOS);
	
  function buscaEventos() {
      eventosObjectStore.getAll().then(function(eventosList) {  
           $scope.listView = eventosList;        
      });		
  }
	
	$scope.setMaster = function(section) {
	    $scope.selected = section;
	};
	
	$scope.isSelected = function(section) {
	    return $scope.selected === section;
	};
		
	$scope.removeEvento = function(key) {
		eventosObjectStore.delete(key).then(function() {			
			buscaEventos();
		});
	};
	
	if($indexedDB.onDatabaseError) {
		$location.path('/unsupported');
	} else {	
		buscaEventos();
	}
			
}]);

imoveisDbControllers.controller('EventosEditCtrl', ['$scope', '$log', '$rootScope', '$routeParams', '$location',  '$indexedDB', '$filter',
    function($scope, $log, $rootScope, $routeParams, $location, $indexedDB, $filter) {
      
    if ($routeParams.type === "edit") {$scope.entidade = "Alterar Evento";}
    else {$scope.entidade = "Incluir Evento";}
      
    /**
    * @type {ObjectStore}
    */
    var eventosObjectStore = $indexedDB.objectStore(OBJECT_STORE_EVENTOS);    
    var contratosObjectStore = $indexedDB.objectStore(OBJECT_STORE_CONTRATOS);    
    var clientesObjectStore = $indexedDB.objectStore(OBJECT_STORE_CLIENTES);    
    var imoveisObjectStore = $indexedDB.objectStore(OBJECT_STORE_IMOVEIS);
    
    $scope.novoevento = {};
    $scope.relacao = {};
    $scope.novoevento.relacionados = [];
    $scope.itemsList = [];
    
    //$scope.relacao = {};
    $scope.tiposEvento = [{text:"Boleto",value:"boleto"},{text:"Contrato",value:"contrato"},{text:"Renovação",value:"renovacao"},{text:"Pagamento",value:"pagamento"}];    
    $scope.tiposRelacao = [{text:"Cliente",value:"cliente"},{text:"imóvel",value:"imovel"},{text:"Contrato",value:"contrato"}];
    $scope.tiposSituacao = [{text:"Ativo",value:"ativo"},{text:"À Vencer",value:"avencer"},{text:"Vencido",value:"vencido"},{text:"Liquidado",value:"liquidado"}];
    $scope.novoevento.situacao = "ativo";
    
    $scope.today= function() {
        $scope.dt = new Date();
    };
    
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.dateOptions = {
        formatDay: 'dd',
        formatMonth: 'MM',
        formatYear: 'yyyy',
        startingDay: 1
    };
    
    $scope.incluirRelacionado = function(){
        if ($scope.relacao.relacionado !== ''){
            $scope.novoevento.relacionados.push($scope.relacao);
            $scope.relacao = {};
        }
    };
    
    $scope.removeRelacao = function(index){
        $scope.novoevento.relacionados.splice(index, 1);
    };
    
    $scope.buscarRelacoes = function(escolha){
      
      switch (escolha.value){
          case "cliente":
            clientesObjectStore.getAll().then(function(itemsList) {
              $scope.itemsList = itemsList;
            });		
            break;
          case "imovel":
            imoveisObjectStore.getAll().then(function(itemsList) {
              $scope.itemsList = itemsList;
            });		
            break;
          case "contrato":
            contratosObjectStore.getAll().then(function(itemsList) {
              $scope.itemsList = itemsList;
            });		
            break;
          default:
            return;
      }
      
    };
    
    $scope.cancel = function() {
        
    };
  
    $scope.submit = function() {
        
        $scope.novoevento.updated = $filter('dateFormat')(new Date(),false);
        
        if ($routeParams.type !== "edit"){
            $scope.novoevento.created = $filter('dateFormat')(new Date(),false);
            $scope.novoevento.synced = null;
        }
        
        var dtAvencer = new Date();
        dtAvencer.setDate(dtAvencer + 7);
        
        if ($scope.picker < $scope.novoevento.updated) {
          $scope.novoevento.situacao = "vencido";
        }
        else if ($scope.picker < dtAvencer) {
          $scope.novoevento.situacao = "avencer";
        }
        else {
          $scope.novoevento.situacao = "ativo";
        }
        
        $scope.novoevento.dataInicio = $filter('dateFormat')($scope.novoevento.updated, true);
        $scope.novoevento.dataVencimento = $filter('dateFormat')($scope.picker, true);
        
        //alert($filter('json')($scope.novoevento));
        
        eventosObjectStore
          .upsert($scope.novoevento)
              .then(function(e){
                   $log.info('Evento' + $scope.novoevento.id + 'incluído com vencimento em:'+  $scope.novoevento.dataVencimento +  ' at:' + new Date());
                   $location.path('/cadastro/eventos').replace();
        });
      
    };
  
    function buscaInfo() {
      
      if($routeParams.id) {
        var myQuery = $indexedDB.queryBuilder().$eq(Number($routeParams.id)).$asc().compile();
        eventosObjectStore.each(
          function(evento){
            $scope.novoevento.id = evento.value.id;
            $scope.novoevento.relacionados = evento.value.relacionados;
            $scope.novoevento.situacao = evento.value.situacao;
            $scope.novoevento.dataInicio = evento.value.dataInicio;
            $scope.novoevento.dataVencimento = evento.value.dataVencimento;
            $scope.novoevento.descricao = evento.value.descricao;
            $scope.novoevento.tipo = evento.value.tipo;
            $scope.novoevento.titulo = evento.value.titulo;
          }
        ,myQuery);
      }
    }
    
    if($indexedDB.onDatabaseError) {
      $location.path('/unsupported');
    } else {
      buscaInfo();
    }
}]);

 
function CalendarModuleCtrl($scope,$compile,uiCalendarConfig) {
    			
	var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
    
  $scope.changeTo = 'Portuguese';
  $scope.eventos = [];
    
  $scope.calEventsExt = {
       color: '#f00',
       textColor: 'yellow',
       events: [ 
          {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.eventos.splice(index,1);		
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
        element.attr({'tooltip': event.title,
                     'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    $scope.changeLang = function() {
      if($scope.changeTo === 'Portuguese'){
        $scope.uiConfig.calendar.dayNames = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
        $scope.uiConfig.calendar.dayNamesShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        $scope.changeTo= 'English';
      } else {
        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $scope.changeTo = 'Portuguese';
      }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventos];
    
} 
/* EOF */


