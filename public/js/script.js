const socket = io();

        let map;
        const markers = {};
        let customMarker = null;
        let polyline = null;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                socket.emit("sendLocation", { latitude, longitude });

                map = L.map("map").setView([latitude, longitude], 13);

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "© OpenStreetMap contributors"
                }).addTo(map);

                markers['user'] = L.marker([latitude, longitude]).addTo(map);

                
                map.on('click', (e) => {
                    const { lat, lng } = e.latlng;
                    addCustomMarker(lat, lng);
                });
            });
        }

        socket.on("receiveLocation", (data) => {
            const { id, latitude, longitude } = data;

            if (!markers[id]) {
                markers[id] = L.marker([latitude, longitude]).addTo(map);
            } else {
                markers[id].setLatLng([latitude, longitude]);
            }

            map.setView([latitude, longitude], 13);

            if (markers["user"] && markers[id]) {
                const userLatLng = markers["user"].getLatLng();
                const otherLatLng = markers[id].getLatLng();
                const distance = userLatLng.distanceTo(otherLatLng);
                console.log(`Distance: ${distance} meters`);

                if (polyline) {
                    map.removeLayer(polyline);
                }

                polyline = L.polyline([userLatLng, otherLatLng], { color: 'blue' }).addTo(map)
                    .bindPopup(`Distance: ${(distance / 1000).toFixed(2)} km`)
                    .openPopup();
            }
        });

        function addCustomMarker(latitude, longitude) {
    
            if (customMarker) {
                map.removeLayer(customMarker);
            }

           
            customMarker = L.marker([latitude, longitude]).addTo(map);
            const userLatLng = markers['user'].getLatLng();
            const customLatLng = customMarker.getLatLng();
            const distance = userLatLng.distanceTo(customLatLng);
            console.log(`Distance: ${distance} meters`);

            
            if (polyline) {
                map.removeLayer(polyline);
            }

            
            polyline = L.polyline([userLatLng, customLatLng], { color: 'blue' }).addTo(map)
                .bindPopup(`Distance: ${(distance / 1000).toFixed(2)} km`)
                .openPopup();
        }