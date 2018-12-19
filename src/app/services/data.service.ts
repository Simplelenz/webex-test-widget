import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  private spark: any;
  private accessToken: string;
  constructor() {
  }

  getSpark() {
    return this.spark;
  }

  setSpark(spark: any) {
    this.spark = spark;
  }

  getAccessToken() {
    return this.accessToken;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }
}
