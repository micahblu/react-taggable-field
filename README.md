# React Taggable Field

ReactTaggableField is a react component that allows for inlining tag labels in a text input field. It supports multiple tag sets triggered by a configured character. `onChange` will return an object with text, html and inlined tags.

## Demo
![](src/react-taggable-field-demo.gif)

### Getting started
```
npm i react-taggable-field
```
### Usage
React Taggable Field is an uncontrolled input, so to clear the input from say a submit button you'll need to create a ref and pass it as the clearRef prop of the React Taggable Field component that will have a clear method assigned to it.

```js
const rftClear = useRef()
```

```js
<ReactTaggableField
	clearRef={rtfClear}
	autoFocus={true}
	onChange={({ text, __html, tags}) => {
		// do something on change
	}}
	defaultValue={''}
	placeHolder='Write away'
	onSubmit={({ text, __html, tags}) => {
		// do something and clear the input
		rtfClear.current()
	}}
	inputClass='demo-input'
	tags={[{
		triggerSymbol: '#',
		highlightClass: 'thingHighlight',
		tagClass: 'thingTag',
		suggestions: [
			{ id: 1, label: 'work', tagClass: 'customTagClass1', style: {background: 'purple'} },
			{ id: 2, label: 'Alpha Project', tagClass: 'customTagClass2' },
			{ id: 3, label: 'Beta Project', tagClass: 'customTagClass3' },
			{ id: 4, label: 'funny', tagClass: 'customTagClass4' },
			{ id: 5, label: 'fitness', tagClass: 'customTagClass5' },
			{ id: 6, label: 'inspiring', tagClass: 'customTagClass6' }
		]}, {
		triggerSymbol: '@',
		highlightClass: 'peopleHighlight',
		tagClass: 'peopleTag',
		suggestions: [
			{ label: 'Elon Musk' },
			{ label: 'Mike Tyson' },
			{ label: 'Albert Einstein' },
			{ label: 'Richard Feynman' },
			{ label: 'Nikola Tesla' }
		]}
	]}
/>
<button
	onClick={() => {
		rtfClear.current()
	}}
>
```

### Why

I wanted an input field that allows inlining multiple sets of tags triggered by any confiugured trigger character.