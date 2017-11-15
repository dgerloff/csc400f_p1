var pow_slider = document.getElementById('slider-power');
var ele_slider = document.getElementById('slider-elevation');
var azi_slider = document.getElementById('slider-azimuth');

var pow_label = document.getElementById('val-power');
var ele_label = document.getElementById('val-elevation');
var azi_label = document.getElementById('val-azimuth');

var launcher_power = pow_slider.value;
var launcher_elevation = ele_slider.value;
var launcher_azimuth = azi_slider.value;

function updateSlider(value,prop){
    switch (prop){
        case 'power':
            launcher_power = value;
            pow_label.innerHTML = value;
            break;
        case 'elevation':
            launcher_elevation = value;
            ele_label.innerHTML = value;
            break;
        case 'azimuth':
            launcher_azimuth = value;
            azi_label.innerHTML = value;
            break;
        default:
            break;
    }
}