import { Component, inject, OnInit } from '@angular/core';
import { BeneficioService } from '@/core/beneficio.service';
import { Beneficio } from '@/shared/models/beneficio';
import { Column } from '@/shared/models/column';
import { debounceTime, finalize, Subject } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { MessageUtil } from '@/shared/utils/message.util';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Page } from '@/shared/classes/page';
import { BENEFICIOS_IMPORTS } from './imports';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';

@Component({
    selector: 'app-beneficio',
    standalone: true,
    imports: BENEFICIOS_IMPORTS,
    template: `
    <div class="card shadow-md">
        <p-toolbar class="mb-4">
            <ng-template #start>
                <h4>Lista de Benefícios</h4>
            </ng-template>
            <ng-template #end>
                <p-iconfield class="mr-4">
                    <p-inputicon class="pi pi-search" />
                    <input pInputText type="text" [(ngModel)]="globalSearch" placeholder="Buscar..."
                        (ngModelChange)="filterSubject$.next(globalSearch)" fluid />
                </p-iconfield>
                <p-button icon="pi pi-plus" pTooltip="Inserir novo benefício" (onClick)="handleOpenRegister('add')" />
            </ng-template>
        </p-toolbar>

        <p-accordion value="1">
            <p-accordion-panel value="0">
                <p-accordion-header>Filtros Avançados</p-accordion-header>
                <p-accordion-content>
                    <form [formGroup]="filtrosForm" class="grid grid-cols-12 gap-4">
                        <p-floatlabel class="col-span-4">
                            <input pInputText type="text" formControlName="nome" fluid>
                            <label for="nome">Nome</label>
                        </p-floatlabel>
                        <p-floatlabel class="col-span-4">
                            <input pInputText type="text" formControlName="descricao" fluid>
                            <label for="descricao">Descrição</label>
                        </p-floatlabel>
                        <p-floatlabel class="col-span-2">
                            <p-inputnumber inputId="minmaxfraction" mode="decimal" [minFractionDigits]="2"
                                [maxFractionDigits]="2" formControlName="valor" fluid />
                            <label for="valor">Valor</label>
                        </p-floatlabel>
                        <p-floatlabel class="col-span-2">
                            <p-select [options]="ativoOptions" optionLabel="label" optionValue="value"
                                formControlName="ativo" fluid appendTo="body" />
                            <label for="ativo">Ativo</label>
                        </p-floatlabel>
                    </form>

                    <div class="flex justify-end mt-5">
                        <p-button label="Filtrar" icon="pi pi-filter" severity="secondary" outlined
                        (onClick)="getBeneficioRequest(true)" class="mr-2" />
                        <p-button label="Limpar Filtros" severity="danger" (onClick)="handleClearFiltros()" />
                    </div>
                </p-accordion-content>
            </p-accordion-panel>
        </p-accordion>

        <p-table [value]="page.content" [columns]="columns" [loading]="loading" stripedRows size="large"
            selectionMode="single">
            <ng-template #header let-columns>
                <tr>
                    @for (col of columns; track $index) {
                        <th> {{col.header}} </th>
                    }
                </tr>
            </ng-template>
            <ng-template #body let-rowData let-columns="columns">
                <tr>
                    @for (col of columns; track $index) {
                        @if (col.field !== 'acao' && col.field !== 'ativo') {
                            <td>
                                {{ col.type ? col.type.transform(rowData[col.field], col.arg1, col.arg2, col.arg3) : rowData[col.field] }}
                            </td>
                        } @else if (col.field === 'ativo') {
                            <td>
                                <p-checkbox [(ngModel)]="rowData[col.field]" binary readonly />
                            </td>
                        } @else if (col.field === 'acao') {
                            <td>
                                <div class="flex gap-2">
                                    <p-button icon="pi pi-pencil" severity="info" rounded pTooltip="Editar"
                                        (onClick)="handleOpenRegister('edit', rowData)" raised />
                                    <p-button icon="pi pi-trash" severity="danger" rounded pTooltip="Excluir"
                                        (onClick)="handleDeleteBeneficio(rowData.id)" raised />
                                </div>
                            </td>
                        }
                    }
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td colspan="7">
                        <p class="font-semibold text-center p-6">Nenhum Resultado Encontrado.</p>
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-paginator [rows]="page.size" [totalRecords]="page.totalElements"
            [rowsPerPageOptions]="[5,10,15,20]" (onPageChange)="handlePageChange($event)" />
    </div>

    <app-beneficio-cadastro [visible]="registerVisible" [state]="registerState" [data]="registerData"
        (onClose)="registerVisible = false" (onConfirm)="handleOnConfirmation()" />
  `
})
export class BeneficioComponent implements OnInit {
    private readonly beneficioService = inject(BeneficioService);
    private readonly confirmService = inject(ConfirmationService);
    private readonly messageUtil = inject(MessageUtil);
    private readonly currencyPipe = inject(CurrencyPipe);
    private readonly router = inject(Router);

    public page: Page<Beneficio> = new Page<Beneficio>;
    public loading: boolean = false;
    public registerVisible: boolean = false;
    public registerState: string = '';
    public registerData!: Beneficio;
    public globalSearch: string = '';

    public columns: Column[] = [
        { header: 'ID', field: 'id' },
        { header: 'Nome', field: 'nome' },
        { header: 'Descrição', field: 'descricao' },
        { header: 'Valor', field: 'valor', type: this.currencyPipe, arg1: 'BRL' },
        { header: 'Ativo', field: 'ativo' },
        { header: 'Versão', field: 'version' },
        { header: 'Ações', field: 'acao' }
    ];

    public ativoOptions = [
        { label: 'Ativo', value: true },
        { label: 'Inativo', value: false },
    ];

    public filtrosForm: FormGroup = new FormGroup({
        nome: new FormControl(''),
        descricao: new FormControl(''),
        valor: new FormControl(0.00),
        ativo: new FormControl(true),
    });

    public filterSubject$ = new Subject<any>();

    constructor() {
        this.filterSubject$.pipe(debounceTime(500)).subscribe(() => this.getBeneficioRequest(true));

        const nav = this.router.getCurrentNavigation();
        const data = nav?.extras.state?.['data'];

        if (data) {
            this.handleOpenRegister('edit', data);
        }
    }

    ngOnInit(): void {
        this.getBeneficioRequest(false);
    }

    public getBeneficioRequest(filter: boolean): void {
        this.loading = true;

        const params = new Map<string, any>();

        if (filter) {
            const filtrosAlterados = Object.entries(this.filtrosForm.controls)
                .filter(([_, control]) => control.dirty && control.value !== null && control.value !== '')
                .map(([key, control]) => [key, control.value]);

            filtrosAlterados.forEach(([key, value]) => params.set(key, value));

            if (this.globalSearch && this.globalSearch !== '' && filtrosAlterados.length === 0) params.set('search', this.globalSearch);
        }

        this.beneficioService.listarPaginado(params, this.page)
            .pipe(finalize(() => this.loading = false))
            .subscribe(({
                next: (res: Page<Beneficio>) => this.page = res,
                error: (err) => this.messageUtil.error(err.error.mensagem)
            }));
    }

    public handleOpenRegister(state: string, data?: Beneficio): void {
        this.registerVisible = true;
        this.registerState = state;
        this.registerData = data;
    }

    public handleDeleteBeneficio(id: number): void {
        this.confirmService.confirm({
            message: 'Deseja remover o benefício?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.beneficioService.remover(id).subscribe({
                    next: (res) => {
                        this.messageUtil.success(res.mensagem);
                        this.getBeneficioRequest(false);
                    },
                    error: (err) => this.messageUtil.error(err.error.mensagem)
                });
            }
        });
    }

    public handleOnConfirmation(): void {
        this.registerVisible = false;
        this.getBeneficioRequest(false);
    }

    public handleClearFiltros(): void {
        this.filtrosForm.reset({
            nome: '',
            descricao: '',
            valor: 0.00,
            ativo: true
        });

        this.getBeneficioRequest(true);
    }

    public handlePageChange(event: PaginatorState): void {
        this.page.number = event.page ?? 0;
        this.page.size = event.rows ?? 0;
        this.getBeneficioRequest(false);
    }
}
