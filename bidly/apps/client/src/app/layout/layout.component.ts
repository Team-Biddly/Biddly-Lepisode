import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { PermissionMiddleware } from '../../middleware/permission.middleware';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
})
export class LayoutComponent {}
