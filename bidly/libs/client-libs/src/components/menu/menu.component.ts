import { booleanAttribute, Component, input } from "@angular/core";
import { BaseConfig } from "../common/config/config.adapter";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-menu",
  standalone: true,
  templateUrl: "./menu.component.html",
  imports: [CommonModule],
})
export class Menu extends BaseConfig {
  overflow = input<boolean, string>(false, { transform: booleanAttribute });
}
