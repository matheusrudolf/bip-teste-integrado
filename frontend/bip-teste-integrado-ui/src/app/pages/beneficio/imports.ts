import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { BeneficioCadastroComponent } from "./components/beneficio-cadastro.component/beneficio-cadastro.component";
import { AccordionModule } from 'primeng/accordion';
import { FloatLabel } from "primeng/floatlabel";
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { PaginatorModule } from 'primeng/paginator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

export const BENEFICIOS_IMPORTS = [
    ToolbarModule,
    ButtonModule,
    TooltipModule,
    TableModule,
    CheckboxModule,
    FormsModule,
    BeneficioCadastroComponent,
    AccordionModule,
    FloatLabel,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ReactiveFormsModule,
    PaginatorModule,
    IconFieldModule,
    InputIconModule,
    FormsModule
];
