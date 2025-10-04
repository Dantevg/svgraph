export default `
:host {
	display: flex;
	flex-direction: column;
	height: 100%;
}
:host([hidden]) {
	display: none;
}

h1 {
	margin: 0 0 0.5em 0;
	font-size: 1.5em;
	text-align: center;
}
h1:empty {
	display: none;
}

svg-popup {
	position: absolute;
	padding: 0.5em 0.6em;
	white-space: nowrap;
	background: #2228;
	border: 1px solid #FFF1;
	border-radius: 10px;
	box-shadow: 1px 2px 20px 0px #0008;
	backdrop-filter: blur(20px);
	pointer-events: none; /* prevent fast mouse movements from triggering mouseleave on svg */
}
svg-popup h3 {
	margin: 0 0 0.4em 0;
}
svg-popup table {
	margin-bottom: -0.1em;
}
svg-popup .name {
	font-family: monospace;
	font-size: 1.2em;
	font-weight: bold;
}
svg-popup .value {
	text-align: right;
	border-left: 0.5em solid transparent;
}

svg-legend {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin: 5px;
}
svg-legend .legend-item {
	padding: 0.25em 0.6em;
	border: 1px solid transparent;
	border-radius: 1em;
}
svg-legend .legend-item:hover {
	background: #FFF1;
	border: 1px solid #FFF1;
	box-shadow: 1px 2px 5px 0px #0004;
	backdrop-filter: blur(20px);
	cursor: pointer;
}
svg-legend .legend-item.disabled {
	opacity: 0.5;
	text-decoration: line-through;
}

.swatch {
	display: inline-block;
	width: 0.75em;
	height: 0.75em;
	margin-right: 0.5em;
	border-radius: 50%;
}
	
.xaxis text, .yaxis text {
	transform-box: fill-box;
}`
