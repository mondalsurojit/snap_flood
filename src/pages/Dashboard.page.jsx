import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Upload, Video, Image as ImageIcon, MapPin, Settings, X, ChevronDown } from 'lucide-react';

const BACKEND_URL   = import.meta.env.VITE_BACKEND_URL;
const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE, 10); // 20 MB
const MAX_FILES     = parseInt(import.meta.env.VITE_MAX_FILES, 10);     // 10

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [location, setLocation] = useState('Fetching location...');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [floodCondition, setFloodCondition] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [remarks, setRemarks] = useState('');
  const [waterDepth, setWaterDepth] = useState(1.2);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // UI State
  const [showLocationEdit, setShowLocationEdit] = useState(false);
  const [showMediaPreview, setShowMediaPreview] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const address = data.display_name || "Location fetched";
            setLocation(address);
            setCity(data.address?.city || data.address?.town || '');
            setStreet(data.address?.road || '');
            setLandmark(data.address?.suburb || '');
          } catch (error) {
            console.error('Error fetching address:', error);
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocation('Enable location services');
        }
      );
    }
  };

  const handleFileSelect = (e) => {
    const incoming = Array.from(e.target.files);

    const slots = MAX_FILES - mediaFiles.length;
    if (slots <= 0) {
      alert(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    const valid = incoming.slice(0, slots).filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`"${file.name}" exceeds the ${MAX_FILE_SIZE / (1024 * 1024)} MB limit and was skipped.`);
        return false;
      }
      return true;
    });

    setMediaFiles((prev) => [...prev, ...valid]);
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (mediaFiles.length === 0) {
      alert('Please upload at least one photo or video');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      // ── Step 1: Upload files ─────────────────────────────────────────────────
      const uploadFormData = new FormData();
      mediaFiles.forEach((file) => {
        uploadFormData.append('files', file);
      });

      const uploadResponse = await fetch(`${BACKEND_URL}/api/form/upload`, {
        method: 'POST',
        body: uploadFormData,
      });

      setUploadProgress(60);

      if (!uploadResponse.ok) {
        const errText = await uploadResponse.text();
        throw new Error(`Upload failed (${uploadResponse.status}): ${errText}`);
      }

      const uploadResult = await uploadResponse.json();

      // ── Step 2: Submit form metadata ─────────────────────────────────────────
      const formPayload = {
        user: {
          email: currentUser?.email       || null,
          name:  currentUser?.displayName || null,
          uid:   currentUser?.uid         || null,
        },
        location: { full: location, city, street, landmark },
        floodCondition,
        rainfall,
        remarks,
        waterDepth,
        uploadedFiles: uploadResult.files ?? uploadResult,
      };

      const formResponse = await fetch(`${BACKEND_URL}/api/form`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formPayload),
      });

      setUploadProgress(100);

      if (!formResponse.ok) {
        const errText = await formResponse.text();
        throw new Error(`Form submission failed (${formResponse.status}): ${errText}`);
      }

      // ── Reset ────────────────────────────────────────────────────────────────
      setMediaFiles([]);
      setFloodCondition('');
      setRainfall('');
      setRemarks('');
      setWaterDepth(1.2);
      alert('Report submitted successfully!');

    } catch (error) {
      console.error('[SnapFlood] Submission error:', error);
      alert(`Submission failed: ${error.message}`);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const imageCount = mediaFiles.filter(f => f.type.startsWith('image/')).length;
  const videoCount = mediaFiles.filter(f => f.type.startsWith('video/')).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/api/placeholder/40/40" alt="IIT Hyderabad" className="h-10" />
              <span className="text-2xl font-bold text-gray-900 hidden sm:block">SnapFlood</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser?.displayName || "User"}</p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
              {currentUser?.photoURL && (
                <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-primary-500" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

          {/* Location Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-gray-700 truncate">{location}</p>
              </div>
              <button
                onClick={() => setShowLocationEdit(!showLocationEdit)}
                className="ml-2 p-2 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
              >
                <Settings className="w-4 h-4 text-blue-600" />
              </button>
            </div>

            {showLocationEdit && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-3">
                  <input type="text" placeholder="City" value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm" />
                  <input type="text" placeholder="Street" value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm" />
                  <input type="text" placeholder="Landmark" value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm" />
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">

            {/* Flood Condition + Rainfall */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <select value={floodCondition} onChange={(e) => setFloodCondition(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700">
                  <option value="">Flood Condition</option>
                  <option value="No flood">No flood</option>
                  <option value="Water Stagnation">Water Stagnation</option>
                  <option value="Minor flood">Minor flood</option>
                  <option value="Moderate flood">Moderate flood</option>
                  <option value="Severe flood">Severe flood</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <select value={rainfall} onChange={(e) => setRainfall(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700">
                  <option value="">Rainfall</option>
                  <option value="No Rainfall">No Rainfall</option>
                  <option value="Light Rainfall">Light Rainfall</option>
                  <option value="Moderate Rainfall">Moderate Rainfall</option>
                  <option value="Heavy Rainfall">Heavy Rainfall</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Remarks */}
            <textarea placeholder="Add Remarks" value={remarks}
              onChange={(e) => setRemarks(e.target.value)} rows="2"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400" />

            {/* Water Depth Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-base font-medium text-gray-700">
                  How much water level do you feel? (in ft)
                </label>
                <span className="text-xl font-bold text-blue-600">{waterDepth.toFixed(1)} ft</span>
              </div>
              <input type="range" min="0" max="4" step="0.1" value={waterDepth}
                onChange={(e) => setWaterDepth(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" />
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>0 ft</span>
                <span>4 ft</span>
              </div>
            </div>

            {/* Upload + Submit */}
            <div className="flex gap-3 items-center">
              <label className="flex-1 cursor-pointer">
                <input type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-medium transition-colors">
                  <Upload className="w-5 h-5" />
                  {mediaFiles.length === 0 ? 'Upload Photo / Video' : 'Upload More'}
                </div>
              </label>

              {mediaFiles.length > 0 && (
                <div className="relative w-14 h-14 flex-shrink-0 cursor-pointer" onClick={() => setShowMediaPreview(true)}>
                  {mediaFiles.slice(0, 3).map((file, i) => (
                    <div key={i} className="absolute rounded-lg border-2 border-white shadow-md overflow-hidden"
                      style={{ width: `${50 - i * 6}px`, height: `${50 - i * 6}px`, left: `${i * 4}px`, top: `${i * 4}px`, zIndex: 3 - i }}>
                      {file.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <Video className="w-3 h-3 text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold z-10 border-2 border-white">
                    {mediaFiles.length > 9 ? '9+' : mediaFiles.length}
                  </div>
                </div>
              )}

              <button onClick={handleSubmit} disabled={isLoading || mediaFiles.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors relative overflow-hidden">
                {isLoading ? (
                  <>
                    <span>Uploading...</span>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="relative w-5 h-5">
                        <div className="absolute inset-0 border-2 border-white/30 rounded-full"></div>
                        <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin"
                          style={{ clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((uploadProgress * 3.6 - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((uploadProgress * 3.6 - 90) * Math.PI / 180)}%, 50% 50%)` }}>
                        </div>
                      </div>
                    </div>
                  </>
                ) : 'Submit'}
              </button>
            </div>

            {mediaFiles.length > 0 && (
              <p className="text-xs text-gray-500 -mt-2">
                {imageCount} image{imageCount !== 1 ? 's' : ''}, {videoCount} video{videoCount !== 1 ? 's' : ''} selected —{' '}
                <button onClick={() => setShowMediaPreview(true)} className="text-blue-600 hover:text-blue-700 font-medium">
                  View / Manage
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Media Preview Dialog */}
      {showMediaPreview && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Manage Media ({mediaFiles.length})</h3>
              <button onClick={() => setShowMediaPreview(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
              {mediaFiles.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No media uploaded</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {mediaFiles.map((file, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                      {file.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Video className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <button onClick={() => removeMedia(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button onClick={() => setShowMediaPreview(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
  .slider { -webkit-appearance: none; appearance: none; }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 20px; height: 20px; border-radius: 50%;
    background: #3b82f6; cursor: pointer;
    border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    margin-top: -6px;
  }
  .slider::-moz-range-thumb {
    width: 20px; height: 20px; border-radius: 50%;
    background: #3b82f6; cursor: pointer;
    border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  .slider::-webkit-slider-runnable-track {
    background: linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(waterDepth / 4) * 100}%, #e5e7eb ${(waterDepth / 4) * 100}%, #e5e7eb 100%);
    height: 8px; border-radius: 4px;
  }
  .slider::-moz-range-track { background: #e5e7eb; height: 8px; border-radius: 4px; }
  .slider::-moz-range-progress { background: #3b82f6; height: 8px; border-radius: 4px; }
`}</style>
    </div>
  );
}

export default Dashboard;