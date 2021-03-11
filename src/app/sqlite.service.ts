import { Injectable } from '@angular/core'
import { DBResult, RowSet } from './types/dbResult'
import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { SqlService } from './sql-service';
import * as _ from 'lodash'
import * as initSqlJs from 'sql.js'

const DB_URL = '/assets/sqlcourse.db'

@Injectable({
  providedIn: 'root'
})
export class SqliteService extends SqlService {

  private db: any

  constructor(
    private location: Location,
    private httpClient: HttpClient) {
    super()
  }

  async runQuery(query: string): Promise<DBResult> {
    const rowSets = this.db.exec(query)
    _.each(rowSets, (rs: RowSet) => {
      rs.rowCount = rs.values.length
      rs.values = _.take(rs.values, 20000)
    })
    return { query, rowSets }
  }

  private initializePromise: Promise<any>

  public initialize(): Promise<any> {
    if (!this.initializePromise) {
      this.initializePromise = this.doInitialize()
    }
    return this.initializePromise
  }

  private async doInitialize(): Promise<any> {
    try {
      const SQL = await initSqlJs({ locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.4.0/dist/${file}` })
      const url = this.location.prepareExternalUrl(DB_URL)
      const arraybuff = await this.httpClient
        .get(url, { responseType: 'arraybuffer', headers: { 'Cache-Control': 'max-age=30' } })
        .toPromise()
      this.db = new SQL.Database(new Uint8Array(arraybuff))
    } catch (error) {
      console.error(error)
    }
  }

  public async cleanup(): Promise<void> {
    // do nothing for sqlite
  }

  async export(): Promise<any> {
    return this.db.export()
  }
}
