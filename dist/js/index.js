const dbPromise=idb.open("restaurantReviewSite",1,function(e){e.createObjectStore("restReviews",{keypath:"id"})});class DBHelper{static get DATABASE_URL(){return"http://localhost:1337/"}static fetchRestaurants(e){fetch(`${DBHelper.DATABASE_URL}restaurants`).then(e=>e.json()).then(function(t){if(t){const n=t;n.forEach(e=>{dbPromise.then(async t=>{const n=t.transaction("restReviews","readwrite").objectStore("restReviews");await n.get(e.id)||(console.log("store is not in db, adding now"),n.add(e,e.id))})}),e(null,n)}else{const n=`Request failed: ${t.status} - ${t.statusText}`;e(n,null)}}).catch(function(){console.log("Sorry, your internet doesn't seem to be working. Pulling cached data for you now!"),dbPromise.then(function(e){return e.transaction("restReviews","readwrite").objectStore("restReviews").getAll()}).then(function(t){e(null,t)})})}static fetchReviewsById(e,t){const n=`${DBHelper.DATABASE_URL}reviews/?restaurant_id=${e}`;fetch(n).then(e=>e.json()).then(function(e){if(e){t(null,e)}else{const n=`Request failed: ${e.status} - ${e.statusText}`;t(n,null)}}).catch(function(){console.log("Didn't call fetch")})}static fetchRestaurantById(e,t){DBHelper.fetchRestaurants((n,s)=>{if(n)t(n,null);else{const n=s.find(t=>t.id==e);n?t(null,n):t("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(e,t){DBHelper.fetchRestaurants((n,s)=>{if(n)t(n,null);else{const n=s.filter(t=>t.cuisine_type==e);t(null,n)}})}static fetchRestaurantByNeighborhood(e,t){DBHelper.fetchRestaurants((n,s)=>{if(n)t(n,null);else{const n=s.filter(t=>t.neighborhood==e);t(null,n)}})}static fetchRestaurantByCuisineAndNeighborhood(e,t,n){DBHelper.fetchRestaurants((s,a)=>{if(s)n(s,null);else{let s=a;"all"!=e&&(s=s.filter(t=>t.cuisine_type==e)),"all"!=t&&(s=s.filter(e=>e.neighborhood==t)),n(null,s)}})}static fetchNeighborhoods(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].neighborhood),s=t.filter((e,n)=>t.indexOf(e)==n);e(null,s)}})}static fetchCuisines(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].cuisine_type),s=t.filter((e,n)=>t.indexOf(e)==n);e(null,s)}})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e){return`./img/optimized/${e.photograph}-optimized.jpg`}static mapMarkerForRestaurant(e,t){const n=new L.marker([e.latlng.lat,e.latlng.lng],{title:e.name,alt:e.name,url:DBHelper.urlForRestaurant(e)});return n.addTo(newMap),n}}let restaurants,neighborhoods,cuisines;var newMap,markers=[];document.addEventListener("DOMContentLoaded",e=>{initMap(),fetchNeighborhoods(),fetchCuisines()}),fetchNeighborhoods=(()=>{DBHelper.fetchNeighborhoods((e,t)=>{e?console.error(e):(self.neighborhoods=t,fillNeighborhoodsHTML())})}),fillNeighborhoodsHTML=((e=self.neighborhoods)=>{const t=document.getElementById("neighborhoods-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),fetchCuisines=(()=>{DBHelper.fetchCuisines((e,t)=>{e?console.error(e):(self.cuisines=t,fillCuisinesHTML())})}),fillCuisinesHTML=((e=self.cuisines)=>{const t=document.getElementById("cuisines-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),initMap=(()=>{self.newMap=L.map("map",{center:[40.722216,-73.987501],zoom:12,scrollWheelZoom:!1}),L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}",{mapboxToken:"pk.eyJ1IjoibGluZGFrdDE2IiwiYSI6ImNqaW1sY3Z4bjAxa2EzcHBmaTZ4aTE2dzQifQ.cOXPk5Jme5zrFsUP3KEgLw",maxZoom:18,attribution:'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',id:"mapbox.streets"}).addTo(newMap),updateRestaurants()}),updateRestaurants=(()=>{const e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),n=e.selectedIndex,s=t.selectedIndex,a=e[n].value,r=t[s].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(a,r,(e,t)=>{e?console.error(e):(resetRestaurants(t),fillRestaurantsHTML())})}),resetRestaurants=(e=>{self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers&&self.markers.forEach(e=>e.remove()),self.markers=[],self.restaurants=e}),fillRestaurantsHTML=((e=self.restaurants)=>{const t=document.getElementById("restaurants-list");e.forEach(e=>{t.append(createRestaurantHTML(e)),addMarkersToMap()})}),createRestaurantHTML=(e=>{const t=document.createElement("li"),n=document.createElement("button");n.className="favButton";const s=document.createElement("img");s.src="./img/icons/fav_on.svg",s.className="favorite on hide";const a=document.createElement("img");a.src="./img/icons/fav_off.svg",a.className="favorite off",n.append(a,s),t.append(n);const r=document.createElement("img");r.className="restaurant-img",r.src=DBHelper.imageUrlForRestaurant(e),r.alt=`A photo showcasing the atmosphere of ${e.name}`,t.append(r);const o=document.createElement("h3");o.innerHTML=e.name,t.append(o);const i=document.createElement("p");i.innerHTML=e.neighborhood,t.append(i);const l=document.createElement("p");l.innerHTML=e.address,t.append(l);const c=document.createElement("a");return c.innerHTML="View Details",c.setAttribute("aria-label",`View details for ${e.name}`),c.href=DBHelper.urlForRestaurant(e),t.append(c),t}),addMarkersToMap=((e=self.restaurants)=>{e.forEach(e=>{const t=DBHelper.mapMarkerForRestaurant(e,self.newMap);t.on("click",function(){window.location.href=t.options.url}),self.markers.push(t)})});const trigger=document.querySelector(".favButton");trigger.addEventListener("click",function(e){e.preventDefault();const t=document.querySelector(".on"),n=document.querySelector(".off");t.classList.toggle("hide"),n.classList.toggle("hide")});
//# sourceMappingURL=index.js.map
