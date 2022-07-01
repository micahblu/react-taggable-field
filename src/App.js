import ReactTaggableField from './react-taggable-field'
import './App.css'

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>React Taggable Field</h1>
      </header>
      <ReactTaggableField
        autoFocus={true}
        onChange={({ text, __html, tags}) => {
          console.log('text', text)
          console.log('html', __html)
          console.log('tags', tags)
        }}
        onSubmit={({ text, __html, tags}) => {
          console.log('text', text)
          console.log('html', __html)
          console.log('tags', tags)
        }}
        tags={[{
          triggerSymbol: '#',
          highlightClass: 'thingHighlight',
          tagClass: 'thingTag',
          suggestions: [
            'hobby',
            'cool',
            'motuslist',
            'family',
            'study',
            'recreation',
            'dinner',
            'funny',
            'interesting',
            'inspirational'
          ]}, {
          triggerSymbol: '@',
          highlightClass: 'peopleHighlight',
          tagClass: 'peopleTag',
          suggestions: [
            'Albert Einstein',
            'Richard Feynman',
            'Nikola Tesla',
            'Kurdt Cobain',
            'Mike Tyson',
            'Michael Jordan',
            'Kobe Bryant',
            'Aniken Skywalker',
            'Jordan Peterson'
          ]}
        ]}
      />
    </div>
  )
}

export default App
