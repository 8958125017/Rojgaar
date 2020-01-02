import { Component,Output, EventEmitter,AfterViewInit, Input, ViewChild, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { stringify } from '@angular/core/src/render3/util';
import { parse } from 'url';
declare var google: any;
 
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
 
interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?:string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
  
}
@Component({
  selector: 'Geolocation',
  templateUrl: './Geolocation.Component.html',
  styleUrls: ['./Geolocation.Component.css']
})
export class GeolocationComponent implements OnInit {
  @Output() LatLogEvent = new EventEmitter<string>();
  myform: FormGroup;
  geocoder:any;
  map: Object;
  marker: Object;
  zoom: number;
  
  isSendLatlong:boolean=false;
  public location:Location = {
    lat: 51.678418,
    lng: 7.809007,
    zoom: 8
  };
  constructor(private formBuilder: FormBuilder,) {
}
ngOnInit() {  
  this.myform = this.formBuilder.group({
    'Address': ['', Validators.required]
  });

  this.Googlemap();
}
labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
labelIndex = 0;
markers:any=[];
callback:any;
uluru: Object;
Googlemap(){
  var ltlnStorage=localStorage.getItem("lattlngt");

  if(ltlnStorage && ltlnStorage !=''){
    var latit=ltlnStorage.split(',');
    var locLat=latit[0];
    var locLng=latit[1];
    this.uluru = { lat: parseFloat(locLat), lng: parseFloat(locLng) };
  }else{
    this.uluru = { lat: 28.608942, lng: 77.37200170000006 };
  }
    
  var infowindow = new google.maps.InfoWindow;
  this.geocoder = new google.maps.Geocoder();
  
  var mapProp= {
    center:new google.maps.LatLng(21.0000, 78.0000),
    zoom:8,
  };
  var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
  google.maps.event.addListener(map, 'click', (event)=>
      this.addMarker(this.geocoder,infowindow,event.latLng,map,function(location1,ltng,address){
        if(localStorage.getItem("address")){
          localStorage.removeItem("address");
          localStorage.setItem("address",location1);
          localStorage.removeItem("GoogleMapAdd");
          localStorage.setItem("GoogleMapAdd",address);
        }else{
           localStorage.setItem("address",location1);
           localStorage.setItem("GoogleMapAdd",address);
           
        }
        if(localStorage.getItem("latlnggg")){
          localStorage.removeItem("latlnggg");
          localStorage.setItem("latlnggg",ltng);
        }else{
          localStorage.setItem("latlnggg",ltng);
        }
  },)  
  );
  this.addMarker(this.geocoder,infowindow,this.uluru, map,function(location,ltng,address){
    localStorage.setItem("address",location);
    localStorage.setItem("latlnggg",ltng);
    localStorage.setItem("GoogleMapAdd",address);
  });
}
Getaddress:any=[];

addMarker(geocoder,infowindow,location, map,fn) {
  var latlng = location;
  var splData;
  
   this.LatLogEvent.emit(latlng);
  geocoder.geocode({'location': latlng}, function(results, status) {
    
    if (status === 'OK') {
      if (results[0]) {
        if (this.marker && this.marker.setMap) {                        
          this.marker.setMap(null);                     
        }
      
         this.marker = new google.maps.Marker({                         
          position: latlng,
          map: map,
          draggable: true,
          animation: google.maps.Animation.DROP
        });

        infowindow.setContent(results[0].formatted_address);          
        infowindow.open(map, this.marker);
        
        var address = results[0].formatted_address;
        splData=address.split(',');

        for(var i=splData.length-2;i>=splData.length-2;i--){

          if(splData[i-1]=='Unnamed Road'){
            this.statecity =splData[i];
          }else{
            var av=splData[i-1]+','+splData[i];
            this.statecity =av;
          }

        }
        var LatttLngg=results[0].geometry.location.lat()+','+results[0].geometry.location.lng();
        fn(this.statecity,LatttLngg,address);
        
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
    
  });
}


codeAddress() {                                                          
    var address = this.myform.value['Address'];
    var infowindow = new google.maps.InfoWindow;
    var geocoder = new google.maps.Geocoder();
    var splData;

    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var myOptions = {
                zoom: 11,
                center: results[0].geometry.location,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            var map = new google.maps.Map(document.getElementById("googleMap"), myOptions);

            google.maps.event.addListener(map,'dblclick',function(event) {
              if (this.marker && this.marker.setMap) {                        
                this.marker.setMap(null);                     
              }

              geocoder.geocode({'location': event.latLng}, function(results, status) {
                if (status === 'OK') {
                  if (results[0]) {

                    if (this.marker && this.marker.setMap) {                        
                      this.marker.setMap(null);                     
                    }
                    
                    this.marker = new google.maps.Marker({
                      position: event.latLng, 
                      map: map, 
                      title: event.latLng.lat()+', '+event.latLng.lng(),
                      draggable: true,
                      animation: google.maps.Animation.DROP
                    }); 

                    infowindow.setContent(results[0].formatted_address);          
                    infowindow.open(map, this.marker);

                    var address = results[0].formatted_address;
                    splData=address.split(',');

                    for(var i=splData.length-2;i>=splData.length-2;i--){

                      if(splData[i-1]=='Unnamed Road'){
                        this.statecity =splData[i];
                      }else{
                        var av=splData[i-1]+','+splData[i];
                        this.statecity =av;
                      }
                      localStorage.setItem("address",this.statecity);
                    }
                    var lattlngt=event.latLng.lat()+','+event.latLng.lng();
                    if(localStorage.getItem("latlnggg")){
                      localStorage.removeItem("latlnggg");
                      localStorage.setItem("latlnggg",lattlngt);
                      localStorage.setItem("GoogleMapAdd",address);
                    }else{
                      localStorage.setItem("latlnggg",lattlngt);
                      localStorage.setItem("GoogleMapAdd",address);
                    }                    

                  } else {
                    window.alert('No results found');
                  }
                } else {
                  window.alert('Geocoder failed due to: ' + status);
                }
              });
          });
        }
    });
}
}
