        // Validate the file size and type before uploading
        $(document).ready(function() {
            var rendererStopped = false;
            $('#quality-slider').on('input', function() {
                var value = $(this).val();
                var percent = (value - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
                /// Green to Red based on percentage
                var colors = {
                    1.0: { id: 1, color: "#4caf50" },
                    0.75: { id: 0.75, color: "#8bc34a" },
                    0.5: { id: 0.5, color: "#dcc139" },
                    0.25: { id: 0.25, color: "#ffa43b" },
                    0.0: { id: 0, color: "#fc2d2d" } // Change the red color here
                }
                // Sort keys in descending order
                var keys = Object.keys(colors).sort((a, b) => parseFloat(b) - parseFloat(a));

                // Iterate through sorted keys to find the appropriate color
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var id = parseFloat(key);
                    if (percent >= id) {
                        var color = colors[key].color;
                        break;
                    }
                }


                $(".range-fill").val(percent);
                // Now we need to update the webkit progress value background color
                // We need to edit the webkit progress value background color CSS rule of the stylesheet 0
                var sheet = document.styleSheets[0];
                var rules = sheet.cssRules || sheet.rules;
                for (var i = 0; i < rules.length; i++) {
                    if (rules[i].selectorText === ".range-fill::-webkit-progress-value") {
                        rules[i].style.backgroundColor = color;
                        break;
                    }
                }
            });
            $('#formhacker').click(function(e) {
                e.preventDefault();
                // First we need to click the file input to trigger the file selection dialog
                $('#image').click();
                // Now we need to wait till the user selects a file
                $('#image').on('change', function() {
                    // Now we can submit the form
                    $('#upload-form').submit();
                });
            });
            $('#upload-form').submit(function(e) {
                var file = $('#image')[0].files[0];
                var maxSize = 10 * 1024 * 1024; // 10 MB
                var allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (file.size > maxSize) {
                    alert('The file is too large. Please select a file smaller than 10 MB.');
                    e.preventDefault();
                }
                if (!allowedTypes.includes(file.type)) {
                    alert('The file type is not supported. Please select a JPEG, PNG, or GIF image.');
                    e.preventDefault();
                }
            });
        });

        // Create a 3D panorama of the image using WebGL and Three.js
        $(document).ready(function() {
            $('#create-panorama').click(function() {
                // Hide the button and show the panorama container
                rendererStopped = false;
                $('#panorama-container').show();
                $('#fullscreen').show();

                // Clear existing panorama
                $('#panorama-wrapper').empty();

                // Get the image source
                var image = $('img')[0];
                var src = image.src;

                // Create a scene, a camera, and a renderer
                var scene = new THREE.Scene();
                var camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
                var renderer = new THREE.WebGLRenderer();
                // Totally Responsive Size  
                renderer.setSize(800, 600);
                var panoramaWrapper = document.getElementById('panorama-wrapper');
                panoramaWrapper.appendChild(renderer.domElement);

                // Clear the WebGL context before proceeding
                renderer.getContext().clear(16640);

                // Create a sphere geometry
                var geometry = new THREE.SphereGeometry(500, 60, 40);
                geometry.scale(-1, 1, 1); // Invert the sphere
                
                // Create a texture from the image with quality settings
                var quality = $('#quality-slider').val() / 100;
                var texture = new THREE.TextureLoader().load(src);
                renderer.setPixelRatio(window.devicePixelRatio * quality);
                var material = new THREE.MeshBasicMaterial({map: texture});

                // Create a mesh from the geometry and the material
                var mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);

                // Create an orbit control to enable mouse interaction
                var controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableZoom = $('#enable-zoom').is(':checked');
                controls.enablePan = $('#enable-pan').is(':checked');
                controls.enableDamping = $('#enable-damping').is(':checked');
                controls.enableRotate = $('#enable-rotate').is(':checked');
                controls.minDistance = 100;
                controls.maxDistance = 900;

                // Set the camera speed
                var cameraSpeed = parseFloat($('#camera-speed').val());
                controls.rotateSpeed = cameraSpeed;
                controls.zoomSpeed = cameraSpeed;

                // Set the camera position and look at the center
                camera.position.set(0, 0, 0);
                // camera.lookAt(scene.position);
                // look in front of the camera instead of the bottom-front
                controls.target.set(0, 0, -0.2);

                // Function to handle window resize
                function onWindowResize() {
                    camera.aspect = panoramaWrapper.offsetWidth / panoramaWrapper.offsetHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(panoramaWrapper.offsetWidth, panoramaWrapper.offsetHeight);
                }
                window.addEventListener('resize', onWindowResize);

                // Render the scene
                var animate = function() {
                    if (rendererStopped) return;
                    requestAnimationFrame(animate);
                    controls.update();
                    renderer.render(scene, camera);
                };
                animate();
            });

            // Function to handle resizing of the renderer upon exiting fullscreen
            function onFullscreenExit() {
                if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) return;
                var panoramaWrapper = document.getElementById('panorama-wrapper');
                rendererStopped = true;
                panoramaWrapper.firstChild.remove();

                // Click the button again to recreate the panorama
                $('#create-panorama').click();
            }

            // Toggle the fullscreen mode
            $('#fullscreen').click(function() {
                var element = $('#panorama-wrapper')[0];
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                    document.addEventListener("fullscreenchange", onFullscreenExit, false);
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                    document.addEventListener("mozfullscreenchange", onFullscreenExit, false);
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                    document.addEventListener("webkitfullscreenchange", onFullscreenExit, false);
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                    document.addEventListener("MSFullscreenChange", onFullscreenExit, false);
                }
            });
        });