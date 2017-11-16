var pow_slider = document.getElementById('slider-power');
var ele_slider = document.getElementById('slider-elevation');
var azi_slider = document.getElementById('slider-azimuth');

var pow_label = document.getElementById('val-power');
var ele_label = document.getElementById('val-elevation');
var azi_label = document.getElementById('val-azimuth');

var launcher_power = parseFloat(pow_slider.value);
var launcher_elevation = parseFloat(ele_slider.value);
var launcher_azimuth = parseFloat(azi_slider.value);

function updateSlider(value,prop){
    value = parseFloat(value);
    switch (prop){
        case 'power':
            launcher_power = value;
            pow_label.innerHTML = value;
            break;
        case 'elevation':
            launcher_elevation = value;
            ele_label.innerHTML = value.toFixed(1);
            break;
        case 'azimuth':
            launcher_azimuth = value;
            azi_label.innerHTML = value.toFixed(1);
            break;
        default:
            break;
    }
}