import MagicalArtifact from './components/MagicalArtifact';

const sampleArt = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600';
const sampleDescription =
  'A piece from the Simsiqueste collection — explore form, material, and narrative through contemporary visual language.';

export default function App() {
  return (
    <div className="app">
      <MagicalArtifact displayArt={sampleArt} description={sampleDescription} />
    </div>
  );
}
