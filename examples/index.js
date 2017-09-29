import React from 'react';
import ReactDOM from 'react-dom';

import EasyBytes from '../src/js/EasyBytes';

ReactDOM.render(<EasyBytes id="easybytes" name="default" />, document.getElementById('mount1'));

ReactDOM.render(<EasyBytes id="easybytes-with-default" defaultValue={3072} name="preset" />, document.getElementById('mount2'));

ReactDOM.render(<EasyBytes id="easybytes-with-default" defaultValue={3072} name="preset" multiple={1024} />, document.getElementById('mount3'));

ReactDOM.render(<EasyBytes id="easybytes-with-default" defaultValue={3072} inputClass="form-control" selectClass="form-control" name="bootstrap" />, document.getElementById('mount4'));
