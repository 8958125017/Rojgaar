"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var index_component_1 = require("../Pages/Index/index.component");
var Yuva_Component_1 = require("../Pages/Yuva/Yuva.Component");
var Public_Layout_Component_1 = require("../Pages/Layouts/Public/Public-Layout.Component");
var Secure_Layout_Component_1 = require("../Pages/Layouts/Secure/Secure-Layout.Component");
var auth_guard_1 = require("../Guards/auth.guard");
exports.routes = [
    {
        path: '',
        component: Public_Layout_Component_1.PublicLayoutComponent,
        children: [
            { path: '', component: index_component_1.IndexComponent },
            { path: 'index', component: index_component_1.IndexComponent }
        ]
    }, {
        path: 'yuva',
        component: Secure_Layout_Component_1.SecureLayoutComponent,
        children: [
            { path: '', component: Yuva_Component_1.YuvaComponent },
            { path: 'index', component: index_component_1.IndexComponent },       
        ], canActivate: [auth_guard_1.AuthGuard]
    }
];
exports.routing = router_1.RouterModule.forRoot(exports.routes);
//# sourceMappingURL=app.routing.js.map