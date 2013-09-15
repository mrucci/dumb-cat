(function() {

    var Dumbcat = function() {
        this.eye_element = [
            document.getElementsByClassName('left pupil')[0],
            document.getElementsByClassName('right pupil')[0],
        ]

        this.eye_radius = 30;
        this.eye_speed = 0.02;

        this.eye_center = [
            [380, 280],
            [618, 280]
        ]

        this.eye_pos = [
            [.0, .0],
            [.0, .0]
        ]

        this.look_at([0, 0], 1)
    }

    Dumbcat.prototype.length = function(x) {
        return Math.sqrt(x[0]*x[0] + x[1]*x[1])
    }

    Dumbcat.prototype.normalize = function(x) {
        var l = this.length(x)
        return [x[0]/l, x[1]/l]
    }

    Dumbcat.prototype.saturate = function(x, range) {
        if( x < range[0])
            x = range[0]
        if( x > range[1])
            x = range[1]
        return x
    }

    Dumbcat.prototype.look_at = function(target, speed) {
        speed = speed || this.eye_speed

        var new_eye_pos = [
            this.eye(target[0]),
            this.eye(target[1])
        ]

        for(var i=0; i<2; i++) {
            new_eye_pos[i][0] *= this.eye_radius
            new_eye_pos[i][1] *= this.eye_radius

            new_eye_pos[i][0] += this.eye_center[i][0]
            new_eye_pos[i][1] += this.eye_center[i][1]
        }

        for(var i=0; i<2; i++) {
            this.eye_pos[i][0] += speed * (new_eye_pos[i][0] - this.eye_pos[i][0])
            this.eye_pos[i][1] += speed * (new_eye_pos[i][1] - this.eye_pos[i][1])

            this.eye_element[i].style['-webkit-transform'] = 'translate(' + this.eye_pos[i][0] + 'px,' + this.eye_pos[i][1] + 'px)';
        }
    }

    // Determine the eye position (in Normalized Eye CS) from a target in Window CS
    Dumbcat.prototype.eye = function(target) {
        var factor = 200;
        var d = [target[0] / factor, target[1] / factor]

        var pi = Math.PI
        var e = [.0, .0]
        var t, i;

        i = 0
        t = d[i]
        if(t < -5) {
            e[i] = 1
        } else if(t < -1) {
            e[i] = Math.sin( pi*(t-1)/4 )
        } else if(t < +1) {
            e[i] = Math.sin( pi*t/2 )
        } else if(t < +5) {
            e[i] = Math.sin( pi*(t+1)/4 )
        } else {
            e[i] = -1
        }

        i = 1
        t = d[i]
        if(t < -1) {
            e[i] = -1
        } else if(t < +1) {
            e[i] = Math.sin( pi*t/2 )
        } else {
            e[i] = 1
        }

        return e
    }

    Dumbcat.prototype.be_dumb = function() {
        var self = this

        document.onmousemove = function(evt) {
            evt = (evt || event);
            var mx = evt.clientX
            var my = evt.clientY

            // mouse position in the eye coordinate system
            var target = [
                [mx - self.eye_center[0][0],  my - self.eye_center[0][1]],
                [mx - self.eye_center[1][0],  my - self.eye_center[1][1]]
            ]

            self.look_at(target)
        }
    }

    var DumbcatDebug = function(dumbcat) {
        this.dumbcat = dumbcat
    }

    DumbcatDebug.prototype.debug = function() {
        // draw the eyes
        for(var i=0; i<2; i++) {
            var span = document.createElement('span');
            span.className = 'circle'

            span.style.left = (dumbcat.eye_center[i][0] - dumbcat.eye_radius) + 'px'
            span.style.top = (dumbcat.eye_center[i][1] - dumbcat.eye_radius) + 'px'
            span.style.width = span.style.height = dumbcat.eye_radius*2 + 'px'

            document.getElementsByTagName('body')[0].appendChild(span)

            span = document.getElementsByClassName('dot')[i];
            span.style.display = 'block'
        }
    }

    var dumbcat = new Dumbcat()
    dumbcat.be_dumb()

    var dumbcatDebug = new DumbcatDebug(dumbcat)
    //dumbcatDebug.debug()

})()

/* vim: set sw=4 ts=4 et: */
