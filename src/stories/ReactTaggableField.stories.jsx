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
				</div>

				<div className='demo-output'>
					<label>Text:</label>
					<div>{output.text}</div>

					<label>Html</label>
					<textarea value={output.__html} />

					<label>Tags</label>
					<div>{output.tags?.map(t => t.label).join(', ')}</div>
				</div>
			</div>
		</div>
	)
})
