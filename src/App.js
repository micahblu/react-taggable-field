import ReactTaggable from './react-taggable'
import './App.css'

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>React Taggable</h1>
      </header>
      <ReactTaggable
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
            's6',
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
