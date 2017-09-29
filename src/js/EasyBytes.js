import classNames from 'classnames';
import React from 'react';

class EasyBytes extends React.Component {
	static propTypes = {
		abbr: React.PropTypes.bool,
		defaultUnit: React.PropTypes.number,
		defaultValue: React.PropTypes.number,
		inputClass: React.PropTypes.string,
		multiple: React.PropTypes.oneOf([1024, 1000]),
		name: React.PropTypes.string,
		onChange: React.PropTypes.func,
		placeholder: React.PropTypes.string,
		selectClass: React.PropTypes.string,
	};

	static defaultProps = {
		abbr: false,
		defaultUnit: 3,
		defaultValue: 0,
		inputClass: '',
		multiple: 1000,
		name: null,
		selectClass: '',
	};

	/**
	 * constructor
	 *
	 * @param {object} props Properties
	 *
	 * @returns {void}
	 */
	constructor(props) {
		super(props);

		const initial = this.convertBytesToInput(props.defaultValue, props.defaultUnit);

		this.state = {
			amount: initial.amount,
			unit: props.defaultUnit,
		};

		// Efficient early binding.
		this.onChange = this.onChange.bind(this);
		this.onAmountChange = this.onAmountChange.bind(this);
		this.onUnitChange = this.onUnitChange.bind(this);
	}

	/*
	 * Callback to other react components in the event of a change.
	 *
	 * @params {event} e Synthetic React Event
	 *
	 * @returns {void}
	 */
	onChange() {
		const { onChange } = this.props;

		if (onChange) {
			onChange(this.convertInputToBytes());
		}
	}

	/*
	 * Event handler for amount change.
	 *
	 * @params {event} e Synthetic React Event
	 *
	 * @returns {void}
	 */
	onAmountChange(e) {
		this.setState({
			amount: e.target.value,
		}, this.onChange);
	}

	/*
	 * Event handler for unit change.
	 *
	 * @params {event} e Synthetic React Event
	 *
	 * @returns {void}
	 */
	onUnitChange(e) {
		this.setState({
			unit: e.target.value,
		}, this.onChange);
	}

	/*
	 * Maintain an internal list of different storage sizes.
	 *
	 * @returns {array}
	 */
	getUnits() {
		if (this.props.abbr) {
			return ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
		}

		return ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Terabytes', 'Petabytes'];
	}

	/**
	 * Utility function to round a number to two decimal places.
	 *
	 * @param {float} n
	 *
	 * @returns {number}
	 */
	roundToTwoPlaces(n) {
		return Math.round((n * 100) + ((n * 1000) % 10 > 4 ? 1 : 0)) / 100;
	}

	/*
	 * Convert our internally stored state into human readable bytes.
	 *
	 * @returns {string|int}
	 */
	convertInputToBytes() {
		const { multiple } = this.props;
		const { amount, unit } = this.state;
		let bytes = 0;

		// Convert the return value to a power of settings.multiple[1024]
		if (unit === '0') {
			bytes = parseInt(amount, 10);
		} else {
			bytes = parseFloat(amount) * Math.pow(multiple, parseFloat(unit));
		}

		// Add new amount to the parent input field
		if (!isNaN(bytes)) {
			return parseInt(bytes, 10);
		}

		return '';
	}

	/**
	 * Convert bytes to amount and unit for state.
	 *
	 * @param {number} bytes Number of bytes.
	 * @param {number} multiple Multiple of 1000 or 1024.
	 *
	 * @returns {{amount: number, unit: number}}
	 */
	convertBytesToInput(bytes, multiple) {
		const { defaultUnit } = this.props;
		let unit = Math.min(4, Math.floor(Math.log(bytes) / Math.log(multiple)), 10);
		let amount = this.roundToTwoPlaces(bytes / Math.pow(multiple, unit));

		if (isNaN(amount)) {
			amount = '';
			unit = defaultUnit;
		}

		return {
			amount,
			unit,
		};
	}

	/**
	 * Render the hidden input. This is only rendered if a name is specified.
	 * When providing the name, we render a hidden input so we can submit this
	 * to the server. When name is not provided, we assume this component is
	 * used exclusively through JavaScript (React).
	 *
	 * @returns {XML|null}
	 */
	renderHiddenInput() {
		const { name } = this.props;

		if (name) {
			return (
				<input
					type="hidden"
					name={name}
					value={this.convertInputToBytes()}
				/>
			);
		}

		return null;
	}

	/**
	 * Render the EasyBytes Component.
	 *
	 * @returns {XML}
	 */
	render() {
		const { inputClass, placeholder, selectClass } = this.props;
		const sizes = this.getUnits();
		const { amount, unit } = this.state;
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
			<div className="react-easybytes">
				<input
					type="text"
					className={`${inputClasses} ${inputClass}`}
					onChange={this.onAmountChange}
					placeholder={placeholder}
					value={amount}
				/>
				<select
					className={`${selectClasses} ${selectClass}`}
					onChange={this.onUnitChange}
					value={unit}
				>
					{options}
				</select>
				{this.renderHiddenInput()}
			</div>
		);
	}
}

export default EasyBytes;
