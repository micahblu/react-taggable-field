# React Taggable Field

ReactTaggableField is a react component that allows for inlining tag labels in a text input field. It supports multiple tag sets triggered by a configured character. `onChange` will return an object with text, html and inlined tags.

## Demo
![](src/react-taggable-field-demo.gif)

### Getting started
```
npm i react-taggable-field
```
### Usage

```js
<ReactTaggableField
	autoFocus={true}
	onChange={({ text, __html, tags}) => {
		setOutput({ text, __html, tags })
	}}
	defaultValue={'Hello world'}
	onSubmit={(output, clear) => {
		// do something and clear the input
		setOutput({})
		clear()
	}}
	inputClass='demo-input'
	tags={[{
		triggerSymbol: '#',
		highlightClass: 'thingHighlight',
		tagClass: 'thingTag',
		suggestions: [
			{ label: 'work', tagClass: 'customTagClass1' },
			{ label: 'Alpha Project', tagClass: 'customTagClass2' },
			{ label: 'Beta Project', tagClass: 'customTagClass3' },
			{ label: 'funny', tagClass: 'customTagClass4' },
			{ label: 'fitness', tagClass: 'customTagClass5' },
			{ label: 'inspiring', tagClass: 'customTagClass6' }
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
```

### Why

I wanted an input field that allows inlining multiple sets of tags triggered by any confiugured trigger character.