class ExcursionsAPI {
  constructor(url = 'http://localhost:3000/') {
    this.api = url;
  }

  loadData(path) {
    return this._fetch(path);
  }

  createNewData(tripData, path) {
    const options = {
      method: 'POST',
      body: JSON.stringify(tripData),
      headers: { 'Content-Type': 'application/json' }
    }
    return this._fetch(path, options)
  }

  deleteData(path, id) {
    const options = {
      method: 'DELETE',
    }
    return this._fetch(path, options, id)
  } 

  updateData(updatedEl, path, id) {
    const options = {
      method: 'PUT',
      body: JSON.stringify(updatedEl),
      headers: { 'Content-Type': 'application/json' }
    }
    return this._fetch(path, options, id)
  }


  _fetch(resource = '', options, id = '') {
    const url = this.api + resource + `/${id}`;
    const promise = fetch(url, options);
    return promise      
      .then(res => res.ok ? res.json() : Promise.reject(res))
  }

}

const kk = new ExcursionsAPI();



export default ExcursionsAPI;
