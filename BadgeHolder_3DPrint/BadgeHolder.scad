union() {
    translate([0, 6, 0]) rotate([70,0,0]) {
        difference() {
            union() {
                cube([5, 74, 6]);
                cube([39, 5, 6]);
                translate([34, 0, 0]) cube([5, 74, 6]);
            }
            translate([-1,50,2.1]) cube([41, 25, 1.8]);
        }
    }
    cube([39, 74, 6]);
}

translate([15, 6, 6]) rotate([0, 0, 90]) linear_extrude(1) text("BSides Perth 2025", 5.5);
translate([20, 6, 6]) rotate([0, 0, 90]) linear_extrude(1) text("badge.bsidesperth.com.au", 3);
translate([32, 6, 6]) rotate([0, 0, 90]) linear_extrude(1) text("Designed by badges4.com", 2.4);