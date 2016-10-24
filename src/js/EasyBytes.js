import classNames from 'classnames';
import React from 'react';

class EasyBytes extends React.Component {
	static propTypes = {
		abbr: React.PropTypes.bool,
		defaultUnit: React.PropTypes.number,
		defaultValue: React.PropTypes.number,
		id: React.PropTypes.string,
		inputClass: React.PropsTypes.string,
		multiple: React.PropTypes.oneOf(['1024', '1000']),
		onChange: React.PropTypes.func,
		placeholder: React.PropTypes.string,
		selectClass: React.PropsTypes.string,
	};

	static defaultProps = {
		abbr: false,
		defaultUnit: 3,
		defaultValue: 0,
		multiple: '1000',
	};

	constructor(props) {
		super(props);

		this.state = {
			bytes: props.defaultValue,
			unit: props.defaultUnit,
		};

		// Efficient early binding.
		this.onlyAllowCertainKeys = this.onlyAllowCertainKeys.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onChangeBytes = this.onChangeBytes.bind(this);
		this.onChangeUnit = this.onChangeUnit.bind(this);
	}

	onlyAllowCertainKeys(e) {
		// Block non-numeric and non-navigation keys in widget
		const key = e.charCode || e.keyCode || 0;
		// Allow only the keys listed below
		return (
			key === 8 ||   // backspace
			key === 9 ||   // tab
			key === 37 ||  // left arrow
			key === 39 ||  // right arrow
			key === 46 ||  // delete
			key === 110 || // decimal point
			key === 190 || // period
			(key >= 48 && key <= 57) ||
			(key >= 96 && key <= 105)
		);
	}

	onChange() {
		if (this.props.onChange) {
			this.props.onChange(this.returnValue());
		}
	}

	onChangeBytes(e) {
		this.setState({
			bytes: e.value,
		}, this.onChange);
	}

	onChangeUnit(e) {
		this.setState({
			unit: e.value,
		}, this.onChange);
	}

	getUnits() {
		if (this.props.abbr) {
			return ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
		}

		return ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Terabytes', 'Petabytes'];
	}

	roundToTwoPlaces(n) {
		return Math.round((n * 100) + ((n * 1000) % 10 > 4 ? 1 : 0)) / 100;
	}

	returnValue() {
		const { multiple } = this.props;
		let rtnValue = 0;

		const { amt, unit } = this.displayValue();

		// Convert the return value to a power of settings.multiple[1024]
		if (unit === '0') {
			rtnValue = parseInt(amt, 10);
		} else {
			rtnValue = parseFloat(amt) * Math.pow(multiple, parseFloat(unit));
		}

		// Add new amount to the parent input field
		if (!isNaN(rtnValue)) {
			return parseInt(rtnValue, 10);
		}

		return '';
	}

	displayValue() {
		const { multiple, defaultUnit } = this.props;
		const { bytes } = this.state;
		let i = Math.min(4, Math.floor(Math.log(bytes) / Math.log(multiple)), 10);
		let amt = this.roundToTwoPlaces(bytes / Math.pow(multiple, i));

		if (isNaN(amt)) {
			amt = '';
			i = defaultUnit;
		}

		return {
			amt,
			unit: i,
		};
	}

	render() {
		const { id, inputClass, placeholder, selectClass } = this.props;
		const sizes = this.getUnits();
		const { amt, unit } = this.displayValue();
		const inputClasses = classNames({
			'easybytes-input': true,
		});
		const selectClasses = classNames({
			'easybytes-select': true,
		});
		const options = sizes.map((v, i) => (
			<option value={i} key={i}>
				{v}
			</option>
		));

		return (
			<div className="easybytes">
				<input
					type="text"
					id={`txt_${id}`}
					className={`${inputClasses} ${inputClass}`}
					onKeyDown={this.onlyAllowCertainKeys}
					onKeyUp={this.onChangeBytes}
					placeholder={placeholder}
					value={amt}
				/>
				<select
					id={`sel_${id}`}
					className={`${selectClasses} ${selectClass}`}
					selected={unit}
				>
					{options}
				</select>
			</div>
		);
	}
}

export default EasyBytes;
