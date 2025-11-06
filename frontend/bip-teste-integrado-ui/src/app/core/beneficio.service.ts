import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { Beneficio } from '@/shared/models/beneficio';
import { Observable } from 'rxjs';
import { Content } from '@/shared/classes/content';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BeneficioService extends AbstractService<Beneficio, Beneficio> {

    protected override get resource(): string {
        return 'beneficios';
    }

    public transfer(params: { fromId: number, toId: number, amount: number }): Observable<Content<Beneficio>> {
        let httpParams = new HttpParams()
            .set('fromId', params.fromId)
            .set('toId', params.toId)
            .set('amount', params.amount);

        return this.http.put<Content<Beneficio>>(`${this.endpoint}/transfer`, null, { params: httpParams });
    }

}
