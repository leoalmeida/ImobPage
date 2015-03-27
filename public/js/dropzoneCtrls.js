/**
 * An AngularJS directive for Dropzone.js, http://www.dropzonejs.com/
 * 
 * Usage:
 * 
 * <div ng-app="app" ng-controller="SomeCtrl">
 *   <button dropzone="dropzoneConfig">
 *     Drag and drop files here or click to upload
 *   </button>
 * </div>
 */

dropzone.directive('dropzone', function ($window) {
  return function (scope, element, attrs) {
    var config, dropzone;
    
    
    //var previewNode = document.querySelector("#template");
    //previewNode.id = "";
    //var previewTemplate = previewNode.parentNode.innerHTML;
    //previewNode.parentNode.removeChild(previewNode);
    
    // create a Dropzone for the element with the given options   
    Dropzone.options.uploadSection = false;
    //dropzone = new Dropzone(element[0], config.options);
    //document.body
    dropzone = new Dropzone("#uploadSection", {    // passed into the Dropzone constructor                                        
                                             url:  '/apis/docFile',
                                             maxFilesize: 20,
                                             maxThumbnailFilesize: 5,
                                             headers: {
                                                  'Authorization': 'Bearer ' + $window.sessionStorage.token
                                             },
                                             addRemoveLinks: true,
                                             addOpenLinks: true,
                                             thumbnailWidth: 120,
                                             thumbnailHeight: 120,
                                             parallelUploads: 5,
                                             createImageThumbnails: true,
                                             //previewTemplate: previewTemplate,
                                             autoQueue: false, // Make sure the files aren't queued until manually added           
                                             //previewsContainer: "#previews", // Define the container to display the previews
                                             //clickable: ".fileinput-button", // Define the element that should be used as click trigger to select files.
                                             withCredentials: true,
                                             accept: function(file, done) {
                                                if (file.name == "justinbieber.jpg") {
                                                  done("Naha, you don't.");
                                                }
                                                else { done(); }
                                             },                                             
                                             //dictRemoveFile: '<span class="fa fa-eraser fa-lg"></span>',
                                             dictRemoveFile: 'Remover',
                                             dictCancelUpload: '<span class="fa fa-chain-broker fa-lg"></span>',
                                             dictOpenFile: '<span class="fa fa-cloud-download fa-lg"></span>',
                                             dictCancelUploadConfirmation: "Confirma?",                                             
                                             dictOpenFileConfirmation: 'Deseja abrir o arquivo?',
                                             dictDefaultMessage: "Arraste aqui os documentos!",
                                             init: function() {                          
                                                  document.querySelector("#submit-all").onclick = function() {
                                                        dropzone.enqueueFiles(dropzone.getFilesWithStatus(Dropzone.ADDED));
                                                  };
                                                  document.querySelector("#cancel-all").onclick = function() {
                                                      dropzone.removeAllFiles();
                                                  };                                                  
                                             },                                              
    });
    
    config = {  'eventHandlers': {                
                'addedfile': function(file) {
                    var tags = "texto" 
                    
                    /*file.previewElement.onclick = function() { Dropzone .enqueueFile(file); };                    
                    var input = document.createElement('input');
                    input.setAttribute('name', 'filetags');
                    input.setAttribute('value', '{' + tags + '}');                    
                    document.querySelector("#uploadSection").appendChild(input);*/
                    
                    if (!file.type.match(/image.*/)) {                        
                        if (file.type.match(/json.*/)){
                            dropzone.emit("thumbnail", file, "/img/icons/json.png");
                        } else if (file.type.match(/application.pdf/)){
                            dropzone.emit("thumbnail", file, "/img/icons/pdf.png");
                        } else if (file.type.match(/application*powerpoint/)){
                            dropzone.emit("thumbnail", file, "/img/icons/ppt.png");
                        } else if (file.type.match(/application*word*/)){
                            dropzone.emit("thumbnail", file, "/img/icons/word.png");
                        } else if (file.type.match(/application*excel*/)){
                            dropzone.emit("thumbnail", file, "/img/icons/xls.png");
                        } else if (file.type.match(/text*xml/)){
                            dropzone.emit("thumbnail", file, "/img/icons/xml.png");
                        } else if (file.type.match(/text.csv/)){ 
                            dropzone.emit("thumbnail", file, "/img/icons/csv.png");
                        } else if (file.type.match(/text.plain/)){ 
                            dropzone.emit("thumbnail", file, "/img/icons/txt.png");
                        } 
                    }
                },
                'totaluploadprogress': function(progress) {
                    document.querySelector("#total-progress .progress-bar").style.width = progress + "%";
                },
                'sending': function (file, xhr, formData) {                    
                    // Show the total progress bar when upload starts
                    document.querySelector("#total-progress").style.opacity = "1";
                    // And disable the start button
                    //file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");              
                },
                // Hide the total progress bar when nothing's uploading anymore
                'queuecomplete': function(progress) {
                    document.querySelector("#total-progress").style.opacity = "0";
                },        
                'success': function (file, response) {
                  
                }
    }};
    
    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
        dropzone.on(event, handler);
    });
    
  };
});


