import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, User, Users, ChevronDown, Home, UserCircle, Calendar as CalendarIcon, Eye, EyeOff, Hospital, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Button = ({ children, variant = 'primary', className = '', ...props }) => (
  <button
    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      variant === 'primary'
        ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        : variant === 'outline'
        ? 'text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-blue-500'
        : variant === 'ghost'
        ? 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
        : 'text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, icon: Icon }) => (
  <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
    <div className="flex items-center">
      {Icon && <Icon className="h-5 w-5 text-blue-600 mr-2" />}
      {children}
    </div>
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg leading-6 font-medium text-gray-900 ${className}`}>{children}</h3>
);

const CardContent = ({ children }) => (
  <div className="px-4 py-5 sm:p-6">{children}</div>
);

const CardFooter = ({ children }) => (
  <div className="px-4 py-4 sm:px-6">{children}</div>
);

const Input = ({ ...props }) => (
  <input
    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2"
    {...props}
  />
);

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {children}
  </label>
);

const Select = ({ children, ...props }) => (
  <select
    className="mt-1 block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
    {...props}
  >
    {children}
  </select>
);

// Mocked health data for line chart
const generateHealthData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bloodPressure: Math.floor(Math.random() * (140 - 110 + 1)) + 110,
      heartRate: Math.floor(Math.random() * (95 - 65 + 1)) + 65,
      steps: Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000
    });
  }
  
  return data;
};

export default function PatientDashboard() {
  const [showAppointments, setShowAppointments] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [careTeam, setCareTeam] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [activeMetric, setActiveMetric] = useState('bloodPressure');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatientProfile();
    fetchDoctors();
    fetchAppointments();
    fetchCareTeam();
    fetchPrescriptions();
    setHealthData(generateHealthData());
  }, []);

  const fetchPatientProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch('https://hms-1-1af5.onrender.com/api/patient/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPatientInfo(data);
        setEditedInfo(data);
      } else {
        console.error('Failed to fetch patient profile');
      }
    } catch (error) {
      console.error('Error fetching patient profile:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch('https://hms-1-1af5.onrender.com/api/doctor/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        console.error('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://hms-1-1af5.onrender.com/api/patient/available-slots?doctorId=${doctorId}&date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const slots = await response.json();
        setAvailableSlots(slots);
      } else {
        console.error('Failed to fetch available slots');
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch('https://hms-1-1af5.onrender.com/api/patient/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchCareTeam = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch('https://hms-1-1af5.onrender.com/api/patient/care-team', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCareTeam(data);
      } else {
        console.error('Failed to fetch care team');
      }
    } catch (error) {
      console.error('Error fetching care team:', error);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch('https://hms-1-1af5.onrender.com/patient/prescriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      } else {
        console.error('Failed to fetch prescriptions');
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const getMetricColor = () => {
    switch(activeMetric) {
      case 'bloodPressure': return '#ef4444';
      case 'heartRate': return '#3b82f6';
      case 'steps': return '#10b981';
      default: return '#3b82f6';
    }
  };

  const getMetricUnit = () => {
    switch(activeMetric) {
      case 'bloodPressure': return 'mmHg';
      case 'heartRate': return 'BPM';
      case 'steps': return 'steps';
      default: return '';
    }
  };

  const getYAxisDomain = () => {
    switch(activeMetric) {
      case 'bloodPressure': return [100, 160];
      case 'heartRate': return [60, 100];
      case 'steps': return [0, 12000];
      default: return [0, 'auto'];
    }
  };

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader icon={Calendar}>
            <CardTitle className="text-base font-medium">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {appointments.length}
            </div>
            {appointments.length > 0 ? (
              <p className="text-sm text-gray-600 mt-1">
                Next: Dr. {appointments[0].doctorId.firstName} {appointments[0].doctorId.lastName} at {appointments[0].time}
              </p>
            ) : (
              <p className="text-sm text-gray-600 mt-1">
                No appointments scheduled
              </p>
            )}
          </CardContent>
          <CardFooter className="p-2">
            <Button 
              variant="ghost" 
              className="w-full text-sm text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setShowAppointments(!showAppointments)}
            >
              {showAppointments ? "Hide" : "View"} Appointments
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showAppointments ? "rotate-180" : ""}`} />
            </Button>
          </CardFooter>
          {showAppointments && (
            <div className="px-4 pb-4">
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-t">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appointment.reason}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">{appointment.time}</p>
                      <p className="text-xs text-gray-500">{new Date(appointment.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No appointments scheduled
                </p>
              )}
            </div>
          )}
        </Card>
        
        <Card className="col-span-1">
          <CardHeader icon={FileText}>
            <CardTitle className="text-base font-medium">Active Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{prescriptions.length}</div>
            <p className="text-sm text-gray-600 mt-1">Medications to manage</p>
          </CardContent>
          <CardFooter className="p-2">
            <Button 
              variant="ghost" 
              className="w-full text-sm text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setShowPrescriptions(!showPrescriptions)}
            >
              {showPrescriptions ? "Hide" : "View"} Prescriptions
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showPrescriptions ? "rotate-180" : ""}`} />
            </Button>
          </CardFooter>
          {showPrescriptions && (
            <div className="px-4 pb-4">
              {prescriptions.map((prescription, index) => (
                <div key={index} className="py-3 border-t">
                  <p className="text-sm font-medium text-gray-800">{prescription.medication}</p>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      {prescription.dosage} - {prescription.frequency}
                    </p>
                    <p className="text-xs text-blue-600">
                      Refills: {prescription.refills || 0}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Dr. {prescription.doctorId.firstName} {prescription.doctorId.lastName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        <Card className="col-span-1">
          <CardHeader icon={Users}>
            <CardTitle className="text-base font-medium">Your Care Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{careTeam.length}</div>
            <p className="text-sm text-gray-600 mt-1">Healthcare providers</p>
            <div className="mt-3">
              {careTeam.slice(0, 3).map((member, index) => (
                <div key={index} className="flex items-center space-x-2 py-1">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Dr. {member.firstName} {member.lastName}</span>
                  <span className="text-xs text-gray-500">{member.specialty}</span>
                </div>
              ))}
              {careTeam.length > 3 && (
                <p className="text-xs text-blue-600 mt-2 cursor-pointer">
                  +{careTeam.length - 3} more providers
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-3 md:col-span-2">
          <CardHeader icon={Activity}>
            <CardTitle className="text-base font-medium">Health Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex mb-4 space-x-2">
              <Button 
                className={activeMetric === 'bloodPressure' ? 'bg-red-500' : 'bg-gray-200 text-gray-700'} 
                onClick={() => setActiveMetric('bloodPressure')}
              >
                Blood Pressure
              </Button>
              <Button 
                className={activeMetric === 'heartRate' ? 'bg-blue-500' : 'bg-gray-200 text-gray-700'} 
                onClick={() => setActiveMetric('heartRate')}
              >
                Heart Rate
              </Button>
              <Button 
                className={activeMetric === 'steps' ? 'bg-green-500' : 'bg-gray-200 text-gray-700'} 
                onClick={() => setActiveMetric('steps')}
              >
                Daily Steps
              </Button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={healthData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis domain={getYAxisDomain()} />
                  <Tooltip 
                    formatter={(value) => [`${value} ${getMetricUnit()}`, activeMetric === 'bloodPressure' ? 'Blood Pressure' : 
                                                                         activeMetric === 'heartRate' ? 'Heart Rate' : 'Steps']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={activeMetric} 
                    stroke={getMetricColor()} 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    dot={{ r: 4 }}
                    name={activeMetric === 'bloodPressure' ? 'Blood Pressure' : 
                          activeMetric === 'heartRate' ? 'Heart Rate' : 'Steps'}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 pb-2 border-b border-gray-100">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Blood test results collected</p>
                  <p className="text-xs text-gray-500">Yesterday at 3:45 PM</p>
                </div>
              </li>
              <li className="flex items-start space-x-2 pb-2 border-b border-gray-100">
                <User className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Appointment with Dr. Johnson completed</p>
                  <p className="text-xs text-gray-500">April 2, 2025 at 10:15 AM</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">New prescription added</p>
                  <p className="text-xs text-gray-500">March 30, 2025 at 2:30 PM</p>
                </div>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Activity</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );

  const renderProfile = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/patient/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editedInfo)
        });
        if (response.ok) {
          const updatedProfile = await response.json();
          setPatientInfo(updatedProfile);
          setIsEditing(false);
        } else {
          const errorData = await response.json();
          alert(`Failed to update patient profile: ${errorData.error}`);
        }
      } catch (error) {
        alert('Error updating patient profile. Please try again.');
      }
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={isEditing ? editedInfo?.firstName : patientInfo?.firstName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={isEditing ? editedInfo?.lastName : patientInfo?.lastName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={isEditing ? editedInfo?.email : patientInfo?.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={isEditing ? editedInfo?.phone || '' : patientInfo?.phone || ''}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={isEditing ? editedInfo?.dateOfBirth || '' : patientInfo?.dateOfBirth || ''}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={isEditing ? editedInfo?.address || '' : patientInfo?.address || ''}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  const renderAppointmentBooking = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setAppointmentData(prev => ({ ...prev, [name]: value }));

      if (name === 'doctorId' && value && appointmentData.date) {
        fetchAvailableSlots(value, appointmentData.date);
      } else if (name === 'date' && value && appointmentData.doctorId) {
        fetchAvailableSlots(appointmentData.doctorId, value);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/patient/book-appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(appointmentData)
        });
        if (response.ok) {
          await response.json();
          alert('Appointment booked successfully');
          fetchAppointments(); // Refresh appointments list
          setAppointmentData({
            doctorId: '',
            date: '',
            time: '',
            reason: ''
          });
          setAvailableSlots([]);
        } else {
          const errorData = await response.json();
          alert(`Failed to book appointment: ${errorData.error}`);
        }
      } catch (error) {
        alert('Error booking appointment. Please try again.');
      }
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Schedule a New Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctorId">Select Doctor</Label>
              <Select id="doctorId" name="doctorId" value={appointmentData.doctorId} onChange={handleInputChange} required>
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Appointment Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                value={appointmentData.date} 
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Select 
                id="time" 
                name="time" 
                value={appointmentData.time} 
                onChange={handleInputChange} 
                disabled={!availableSlots.length}
                required
              >
                <option value="">Choose a time slot</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </Select>
              {appointmentData.doctorId && appointmentData.date && !availableSlots.length && (
                <p className="text-sm text-red-500 mt-1">No available slots for this doctor on selected date</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Input 
                id="reason" 
                name="reason" 
                value={appointmentData.reason} 
                onChange={handleInputChange} 
                placeholder="Brief description of your concern"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="mt-4 w-full"
              disabled={!appointmentData.doctorId || !appointmentData.date || !appointmentData.time || !appointmentData.reason}
            >
              Book Appointment
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Hospital className="h-8 w-8 text-blue-600" />
          <span className="font-bold text-xl text-blue-800">HealthConnect</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">{patientInfo?.firstName} {patientInfo?.lastName}</p>
            <p className="text-xs text-gray-500">Patient ID: {patientInfo?._id?.substring(0, 8) || 'N/A'}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Sign Out
          </Button>
        </div>
      </header>
      
      <nav className="bg-blue-700 text-white p-3 sticky top-0 z-10 shadow-md">
        <ul className="flex space-x-4 justify-center">
          <li>
            <Button
              variant={activeTab === 'Dashboard' ? "outline" : "ghost"}
              className={`hover:bg-white hover:text-blue-600 ${activeTab === 'Dashboard' ? 'bg-white text-blue-600' : 'text-white'}`}
              onClick={() => setActiveTab('Dashboard')}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'Profile' ? "outline" : "ghost"}
              className={`hover:bg-white hover:text-blue-600 ${activeTab === 'Profile' ? 'bg-white text-blue-600' : 'text-white'}`}
              onClick={() => setActiveTab('Profile')}
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'Appointment Booking' ? "outline" : "ghost"}
              className={`hover:bg-white hover:text-blue-600 ${activeTab === 'Appointment Booking' ? 'bg-white text-blue-600' : 'text-white'}`}
              onClick={() => setActiveTab('Appointment Booking')}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </li>
        </ul>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome, {patientInfo?.firstName} {patientInfo?.lastName}</h1>
          <p className="text-blue-100 mt-2">Your health is our priority. Monitor your health data and manage appointments all in one place.</p>
        </div>
        
        {activeTab === 'Dashboard' && renderDashboard()}
        {activeTab === 'Profile' && renderProfile()}
        {activeTab === 'Appointment Booking' && renderAppointmentBooking()}
      </main>
      
      <footer className="bg-blue-900 text-white p-6 mt-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Hospital className="h-6 w-6 mr-2" />
              <span className="font-bold">HealthConnect</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm hover:text-blue-200 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-blue-200 transition-colors">Terms of Service</a>
              <a href="#" className="text-sm hover:text-blue-200 transition-colors">Contact Support</a>
            </div>
          </div>
          <div className="mt-4 text-center md:text-left text-xs text-blue-200">
            &copy; 2025 HealthConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}