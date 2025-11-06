import { CurrencyPipe } from "@angular/common";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TooltipModule } from "primeng/tooltip";
import { BeneficioTransferComponent } from "./components/beneficio-transfer.component/beneficio-transfer.component";
import { PaginatorModule } from "primeng/paginator";
import { FormsModule } from "@angular/forms";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";

export const HOME_IMPORTS = [
    ProgressSpinnerModule,
    ButtonModule,
    TooltipModule,
    CurrencyPipe,
    BeneficioTransferComponent,
    BadgeModule,
    PaginatorModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule
];
