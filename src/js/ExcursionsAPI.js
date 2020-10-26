class ExcursionsAPI {
  constructor(url = 'http://localhost:3000/') {
    this.api = url;
  }

  loadData() {
    return this._fetch();
  }

  createNewData(tripData, path) {
    const options = {
      method: 'POST',
      body: JSON.stringify(tripData),
      headers: { 'Content-Type': 'application/json' }
    }
    return this._fetch(options, path)
  }

  deleteData(path, id) {
    const options = {
      method: 'DELETE',
    }
    return this._fetch(options, path, id)
  }

  updateData(updatedEl, path, id) {
    const options = {
      method: 'PUT',
      body: JSON.stringify(updatedEl),
      headers: { 'Content-Type': 'application/json' }
    }
    return this._fetch(options, path, id)
  }


  _fetch(options, resource = '', id = '') {
    const url = this.api + resource + `/${id}`;
    const promise = fetch(url, options);
    return promise
      .then(res => res.ok ? res.json : Promise.reject(res))
  }

}

const kk = new ExcursionsAPI();

export default ExcursionsAPI;
