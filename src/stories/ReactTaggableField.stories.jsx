import { useState } from 'react'
import { storiesOf } from '@storybook/react'
import ReactTaggableField from '../react-taggable-field/react-taggable-field'
import './DemoStyles.css'

const stories = storiesOf('React Taggable Field Test', module)
 
stories.add('ReactTaggableField', () => {
	const [output, setOutput] = useState({})
	return (
		<div className='Demo'>
			<header className='Demo-header'>
				<h1>React Taggable Field</h1>
			</header>
			<div className='container'>
				<div className='input-container'>

					<ReactTaggableField
						autoFocus={true}
						onChange={({ text, __html, tags}) => {
							setOutput({ text, __html, tags })
						}}
						defaultValue='Hello World'
						inputClass='demo-input'
						tags={[{
							triggerSymbol: '#',
							highlightClass: 'thingHighlight',
							tagClass: 'thingTag',
							suggestions: [
								'amazing',
								'cool',
								'funny',
								'interesting',
								'inspiring'
							]}, {
							triggerSymbol: '@',
							highlightClass: 'peopleHighlight',
							tagClass: 'peopleTag',
							suggestions: [
								'Albert Einstein',
								'Richard Feynman',
								'Nikola Tesla'
							]}
						]}
					/>
				</div>

				<div className='demo-output'>
					<label>Text:</label>
					<div>{output.text}</div>

					<label>Html</label>
					<textarea value={output.__html} />

					<label>Tags</label>
					<div>{output.tags?.map(t => t.name).join(', ')}</div>
				</div>
			</div>
		</div>
	)
})
