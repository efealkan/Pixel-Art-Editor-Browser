//Editor Stuff
const size_settings = document.querySelector('.size_settings');
const grid_canvas = document.querySelector('.grid_canvas');
const export_button = document.querySelector('.export_button');
const grid_onoff_button = document.querySelector('.grid_onoff');

//Brushes and Tools
const brush_paint = document.querySelector('.brush_paint');
const brush_erase = document.querySelector('.brush_erase');
const tool_color_picker = document.querySelector('.tool_color_picker');
const brush_fill = document.querySelector('.brush_fill');


const brush_button_backcolor = brush_paint.style.backgroundColor;
const init_canvas_width = document.querySelector('.size_width').value;
const init_canvas_height = document.querySelector('.size_height').value;

var brush_type = 'paint';

function create_canvas() {
    let canvas_width = document.querySelector('.size_width').value;
    let canvas_height = document.querySelector('.size_height').value;

    //Empty Grid Canvas before creating a new one
    while (grid_canvas.firstChild) {
        grid_canvas.removeChild(grid_canvas.firstChild);
    }

    let c = 0;
    let r = 0;

    //Create Grid Canvas 
    for (let i=1; i<=canvas_height; i++) {
        let canvas_row = document.createElement('tr');
        canvas_row.id = r;
        r += 1;
        grid_canvas.appendChild(canvas_row);

        for (let j=1; j<=canvas_width; j++) {
            let canvas_cell = document.createElement('td');
            canvas_cell.id = c;
            c+=1;
            canvas_row.appendChild(canvas_cell);

            //Fill inside of cell
            canvas_cell.addEventListener('mousedown', function() {
                if (brush_type !== 'paint') return;
                const color = document.querySelector('.color_selector').value;
                this.style.backgroundColor = color;
            });
        }   
    }
}

create_canvas(init_canvas_width, init_canvas_height);
set_color_onclick(0);

size_settings.addEventListener('submit', function(e) {
    e.preventDefault(); //Avoids reloading page.
    create_canvas();
});

let mouse_is_pressed = false;

//Default drawing
grid_canvas.addEventListener('mousedown', function(e) {
    mouse_is_pressed = true;
    grid_canvas.addEventListener('mouseup', function() {
        mouse_is_pressed = false;
    });

    grid_canvas.addEventListener('mouseleave', function() {
        mouse_is_pressed = false;
    });

    grid_canvas.addEventListener('mouseover', function(e) {
        const color = document.querySelector('.color_selector').value;

        if (mouse_is_pressed) {
            if (brush_type !== 'paint') return;
            if (e.target.tagName === 'TD') {
                e.target.style.backgroundColor = color;
            }
        }
    });
});

//Paint Brush
brush_paint.addEventListener('click', function() {
    
    brush_type = 'paint';

    set_color_onclick(0);

    grid_canvas.addEventListener('mousedown', function(e) {
        mouse_is_pressed = true;
        grid_canvas.addEventListener('mouseup', function() {
            mouse_is_pressed = false;
        });
    
        grid_canvas.addEventListener('mouseleave', function() {
            mouse_is_pressed = false;
        });
    
        grid_canvas.addEventListener('mouseover', function(e) {
            const color = document.querySelector('.color_selector').value;
            
            if (mouse_is_pressed) {
                if (brush_type !== 'paint') return;

                if (e.target.tagName === 'TD') {
                    e.target.style.backgroundColor = color;
                }
            }
        });
    });

    grid_canvas.addEventListener('mousedown', function(e) {

        if (e.target.tagName === 'TD') {
            if (brush_type !== 'paint') return;

            const color = document.querySelector('.color_selector').value;
            e.target.style.backgroundColor = color;
        }
    });
});

// Erase Brush
brush_erase.addEventListener('click', function() {
    
    brush_type = 'erase';

    set_color_onclick(1);

    grid_canvas.addEventListener('mousedown', function(e) {
        mouse_is_pressed = true;
        grid_canvas.addEventListener('mouseup', function() {
            mouse_is_pressed = false;
        });
    
        grid_canvas.addEventListener('mouseleave', function() {
            mouse_is_pressed = false;
        });
    
        grid_canvas.addEventListener('mouseover', function(e) {    
            if (mouse_is_pressed) {
                if (brush_type !== 'erase') return;

                if (e.target.tagName === 'TD') {
                    e.target.style.backgroundColor = null;
                }
            }
        });
    });

    grid_canvas.addEventListener('mousedown', function(e) {
        if (brush_type !== 'erase') return;

        e.target.style.backgroundColor = null;
    });
});

//Color-Picker
tool_color_picker.addEventListener('click', function() {

    set_color_onclick(3);

    brush_type = 'picker';

    grid_canvas.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'TD') {
            if (brush_type !== 'picker') return;

            const color = RGBToHex(e.target.style.backgroundColor);
            if (color === '#00NaNNaN') return;
            document.querySelector('.color_selector').value = color;
        }
    });
});

//Brush fill
brush_fill.addEventListener('click', function() {

    brush_type = 'fill';
    set_color_onclick(2);

    grid_canvas.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'TD') {
            if (brush_type !== 'fill') return;
            let id = e.target.id;
            let id_row = e.target.parentElement.id;

            fill(id, document.querySelector('.size_width').value, id_row);
        }
    });
});

function fill(id, width, id_row) {
    const td = document.getElementsByTagName('td');
    const org_color = RGBToHex(td[id].style.backgroundColor);
    const color = document.querySelector('.color_selector').value;
    td[id].style.backgroundColor = color;

    let top = +id - +width;
    let bottom = +id + +width;
    let left = +id - +1;
    let right = +id + +1;

    if (left >= 0) {

        if (id_row * width <= left && +((+id_row + +1) * width) - +1 >= left) {
            let left_color = RGBToHex(td[left].style.backgroundColor);

            if (org_color === '#00NaNNaN') {
                if (left_color === '#00NaNNaN') {
                    fill(left, width, id_row);
                }
            } else {
                if (left_color === org_color) {
                    fill(left, width, id_row);
                }
            }
        }
    }
    if (top >= 0) {
        let top_color = RGBToHex(td[top].style.backgroundColor);

        if (org_color === '#00NaNNaN') {
            if (top_color === '#00NaNNaN') {
                fill(top, width, +id_row - +1);
            }
        } else {
            if (top_color === org_color) {
                fill(top, width, +id_row - +1);
            }
        }
    }
    if (bottom < td.length) {
        let bottom_color = RGBToHex(td[bottom].style.backgroundColor);

        if (org_color === '#00NaNNaN') {
            if (bottom_color === '#00NaNNaN') {
                fill(bottom, width, +id_row + +1);            }
        } else {
            if (bottom_color === org_color) {
                fill(bottom, width, +id_row + +1);
            }
        }
    }
    if (right < td.length) {
    
        if (id_row * width <= right && +((+id_row + +1) * width) - +1 >= right) {
            let right_color = RGBToHex(td[right].style.backgroundColor);

            if (org_color === '#00NaNNaN') {
                if (right_color === '#00NaNNaN') {
                    fill(right, width, id_row);
                }
            } else {
                if (right_color === org_color) {
                    fill(right, width, id_row);
                }
            }
        }
    }
}

//Export
export_button.addEventListener('click', function() {

    //Convert table to a canvas
    var grid = document.createElement('canvas');
    grid.id = "grid";
    let tr = document.getElementsByTagName('tr');
    let td = document.getElementsByTagName('td');

    let cols_in_row = td.length / tr.length;
    let square_Size = 1;

    grid.width = cols_in_row * square_Size;
    grid.height = tr.length * square_Size;

    var c = 0;
    var context = grid.getContext("2d");

    context.clearRect(0, 0, grid.width, grid.height); //Clear Canvas
    
    for (var row = 0; row<tr.length; row++) {
        for (var col = 0; col<cols_in_row; col++) {

            var x = col * square_Size;
            var y = row * square_Size;

            let color = RGBToHex(td[c].style.backgroundColor);
            
            if (color === '#00NaNNaN') color = '#ffffff00'
            context.fillStyle = color;
            context.fillRect(x, y, square_Size, square_Size);

            c+=1;
        }
    }

    //Download canvas as png
    var saveAs = function(uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            document.body.appendChild(link); // Firefox requires the link to be in the body
            link.download = filename;
            link.href = uri;
            link.click();
            document.body.removeChild(link); // remove the link when done
        } else {
            location.replace(uri);
        }
    };

    var img = grid.toDataURL("image/png"),
        uri = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

    saveAs(uri, 'my_pixel_art.png'); 
});

var grid_on = true;

//Grid_OnOff
grid_onoff_button.addEventListener('click', function() {
    if (grid_on === true) { //Then close grid.
        grid_on = false;

        let tr = grid_canvas.getElementsByTagName('tr');
        let td = grid_canvas.getElementsByTagName('td');

        for (let i=0; i<tr.length; i++) {
            tr[i].style.border = '0px';
        }
        for (let i=0; i<td.length; i++) {
            td[i].style.border = '0px';
        }
    

        grid_onoff_button.style.backgroundColor = brush_button_backcolor;
    } else { //Then open grid
        grid_on = true;

        let tr = grid_canvas.getElementsByTagName('tr');
        let td = grid_canvas.getElementsByTagName('td');

        for (let i=0; i<tr.length; i++) {
            tr[i].style.border = '1px solid #888888';
        }
        for (let i=0; i<td.length; i++) {
            td[i].style.border = '1px solid #888888';
        }

        grid_onoff_button.style.backgroundColor = 'grey';
    }
});

grid_onoff_button.style.backgroundColor = 'grey';

function set_color_onclick(i)
{
    let brushes = [brush_paint, brush_erase, brush_fill, tool_color_picker];
    brushes[i].style.backgroundColor = 'grey';
    
    for (let j=0; j<brushes.length; j++) {
        if (j != i) {
            brushes[j].style.backgroundColor= brush_button_backcolor;
        }
    }
}

function RGBToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb.substr(4).split(")")[0].split(sep);
  
    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return ("#" + r + g + b).toString();
}

document.onkeypress = function(e) {
    if (e.keyCode === 98) {
        brush_type = 'paint';

        set_color_onclick(0);

        grid_canvas.addEventListener('mousedown', function(e) {
            mouse_is_pressed = true;
            grid_canvas.addEventListener('mouseup', function() {
                mouse_is_pressed = false;
            });
        
            grid_canvas.addEventListener('mouseleave', function() {
                mouse_is_pressed = false;
            });
        
            grid_canvas.addEventListener('mouseover', function(e) {
                const color = document.querySelector('.color_selector').value;
                
                if (mouse_is_pressed) {
                    if (brush_type !== 'paint') return;

                    if (e.target.tagName === 'TD') {
                        e.target.style.backgroundColor = color;
                    }
                }
            });
        });

        grid_canvas.addEventListener('mousedown', function(e) {

            if (e.target.tagName === 'TD') {
                if (brush_type !== 'paint') return;

                const color = document.querySelector('.color_selector').value;
                e.target.style.backgroundColor = color;
            }
        });
    }
    if (e.keyCode === 101) {
        brush_type = 'erase';

        set_color_onclick(1);

        grid_canvas.addEventListener('mousedown', function(e) {
            mouse_is_pressed = true;
            grid_canvas.addEventListener('mouseup', function() {
                mouse_is_pressed = false;
            });
        
            grid_canvas.addEventListener('mouseleave', function() {
                mouse_is_pressed = false;
            });
        
            grid_canvas.addEventListener('mouseover', function(e) {    
                if (mouse_is_pressed) {
                    if (brush_type !== 'erase') return;

                    if (e.target.tagName === 'TD') {
                        e.target.style.backgroundColor = null;
                    }
                }
            });
        });

        grid_canvas.addEventListener('mousedown', function(e) {
            if (brush_type !== 'erase') return;

            e.target.style.backgroundColor = null;
        });
    }
    if (e.keyCode === 102) {
        brush_type = 'fill';
        set_color_onclick(2);

        grid_canvas.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'TD') {
                if (brush_type !== 'fill') return;
                let id = e.target.id;
                let id_row = e.target.parentElement.id;

                fill(id, document.querySelector('.size_width').value, id_row);
            }
        });
    }
    if (e.keyCode === 112) {
        set_color_onclick(3);

        brush_type = 'picker';

        grid_canvas.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'TD') {
                if (brush_type !== 'picker') return;

                const color = RGBToHex(e.target.style.backgroundColor);
                if (color === '#00NaNNaN') return;
                document.querySelector('.color_selector').value = color;
            }
        });
    }
}