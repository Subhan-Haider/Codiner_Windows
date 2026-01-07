export interface LanguageTemplate {
  id: string
  name: string
  language: string
  framework?: string
  description: string
  icon: string
  features: string[]
  complexity: 'beginner' | 'intermediate' | 'advanced'
  popularity: number
  templates: {
    [key: string]: CodeTemplate
  }
}

export interface CodeTemplate {
  name: string
  description: string
  category: string
  code: string
  dependencies?: string[]
  configuration?: any
  preview?: string
  tags: string[]
}

export interface GenerationOptions {
  language: string
  framework?: string
  template?: string
  features?: string[]
  style?: 'minimal' | 'standard' | 'enterprise'
  testing?: boolean
  documentation?: boolean
}

export class MultiLanguageGenerator {
  private static readonly languages: LanguageTemplate[] = [
    {
      id: 'javascript',
      name: 'JavaScript',
      language: 'javascript',
      description: 'Versatile programming language for web development',
      icon: '🟨',
      features: ['Dynamic', 'Event-driven', 'Asynchronous', 'Prototypal inheritance'],
      complexity: 'intermediate',
      popularity: 95,
      templates: {
        'web-app': {
          name: 'Web Application',
          description: 'Modern single-page application with React',
          category: 'web',
          code: `import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>My App</h1>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>
      </header>

      <main className="main">
        <h2>Data Items</h2>
        <ul>
          {data.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);`,
          dependencies: ['react', 'react-dom'],
          tags: ['react', 'frontend', 'spa']
        },
        'api-server': {
          name: 'REST API Server',
          description: 'Express.js REST API with authentication',
          category: 'backend',
          code: `const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (use database in production)
let users = [];
let posts = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(user);

    res.status(201).json({
      message: 'User created successfully',
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/posts', authenticateToken, (req, res) => {
  res.json(posts);
});

app.post('/api/posts', authenticateToken, (req, res) => {
  const { title, content } = req.body;

  const post = {
    id: posts.length + 1,
    title,
    content,
    authorId: req.user.id,
    createdAt: new Date()
  };

  posts.push(post);
  res.status(201).json(post);
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
          dependencies: ['express', 'jsonwebtoken', 'bcryptjs', 'cors', 'dotenv'],
          tags: ['express', 'api', 'authentication', 'rest']
        }
      }
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      language: 'typescript',
      description: 'JavaScript with static type definitions',
      icon: '🔷',
      features: ['Static typing', 'Object-oriented', 'Compile-time checks', 'Enhanced IDE support'],
      complexity: 'intermediate',
      popularity: 85,
      templates: {
        'react-app': {
          name: 'React TypeScript App',
          description: 'Type-safe React application with modern tooling',
          category: 'web',
          code: `import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersResponse, postsResponse] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/posts')
      ]);

      const usersData = await usersResponse.json();
      const postsData = await postsResponse.json();

      setUsers(usersData);
      setPosts(postsData.map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt)
      })));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>TypeScript React App</h1>
        <p>Built with type safety and modern React patterns</p>
      </header>

      <main className="main">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <section className="users-section">
              <h2>Users ({users.length})</h2>
              <div className="users-grid">
                {users.map(user => (
                  <div key={user.id} className="user-card">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="posts-section">
              <h2>Posts ({posts.length})</h2>
              <div className="posts-list">
                {posts.map(post => (
                  <article key={post.id} className="post-card">
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <footer>
                      By {post.author.name} on {post.createdAt.toLocaleDateString()}
                    </footer>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}`,
          dependencies: ['react', 'react-dom', '@types/react', '@types/react-dom', 'typescript'],
          tags: ['react', 'typescript', 'frontend', 'types']
        }
      }
    },
    {
      id: 'python',
      name: 'Python',
      language: 'python',
      description: 'High-level programming language for rapid development',
      icon: '🐍',
      features: ['Readable syntax', 'Large ecosystem', 'Scientific computing', 'Web development'],
      complexity: 'beginner',
      popularity: 90,
      templates: {
        'web-app': {
          name: 'Flask Web Application',
          description: 'Modern web application with Flask and SQLAlchemy',
          category: 'web',
          code: `from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    posts = db.relationship('Post', backref='author', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'author': self.author.username if self.author else None
        }

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/users', methods=['GET', 'POST'])
def users():
    if request.method == 'POST':
        data = request.get_json()

        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400

        user = User(
            username=data['username'],
            email=data['email']
        )

        db.session.add(user)
        db.session.commit()

        return jsonify(user.to_dict()), 201

    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@app.route('/api/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def user_detail(user_id):
    user = User.query.get_or_404(user_id)

    if request.method == 'GET':
        return jsonify(user.to_dict())

    elif request.method == 'PUT':
        data = request.get_json()
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        db.session.commit()
        return jsonify(user.to_dict())

    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return '', 204

@app.route('/api/posts', methods=['GET', 'POST'])
def posts():
    if request.method == 'POST':
        data = request.get_json()
        post = Post(
            title=data['title'],
            content=data['content'],
            user_id=data['user_id']
        )

        db.session.add(post)
        db.session.commit()

        return jsonify(post.to_dict()), 201

    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([post.to_dict() for post in posts])

@app.route('/api/posts/<int:post_id>', methods=['GET', 'PUT', 'DELETE'])
def post_detail(post_id):
    post = Post.query.get_or_404(post_id)

    if request.method == 'GET':
        return jsonify(post.to_dict())

    elif request.method == 'PUT':
        data = request.get_json()
        post.title = data.get('title', post.title)
        post.content = data.get('content', post.content)
        db.session.commit()
        return jsonify(post.to_dict())

    elif request.method == 'DELETE':
        db.session.delete(post)
        db.session.commit()
        return '', 204

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))`,
          dependencies: ['flask', 'flask-sqlalchemy', 'flask-cors'],
          tags: ['flask', 'sqlalchemy', 'api', 'web']
        },
        'data-analysis': {
          name: 'Data Analysis Script',
          description: 'Python script for data processing and analysis',
          category: 'data',
          code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import json
import os
from datetime import datetime

class DataAnalyzer:
    def __init__(self, data_path=None):
        self.data = None
        self.model = None
        self.results = {}

        if data_path and os.path.exists(data_path):
            self.load_data(data_path)

    def load_data(self, file_path):
        """Load data from various file formats"""
        file_extension = os.path.splitext(file_path)[1].lower()

        try:
            if file_extension == '.csv':
                self.data = pd.read_csv(file_path)
            elif file_extension in ['.xlsx', '.xls']:
                self.data = pd.read_excel(file_path)
            elif file_extension == '.json':
                with open(file_path, 'r') as f:
                    json_data = json.load(f)
                self.data = pd.DataFrame(json_data)
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")

            print(f"Loaded data with shape: {self.data.shape}")
            print(f"Columns: {list(self.data.columns)}")
            print(f"Data types:\\n{self.data.dtypes}")

        except Exception as e:
            print(f"Error loading data: {e}")
            self.data = None

    def clean_data(self):
        """Clean and preprocess the data"""
        if self.data is None:
            print("No data loaded")
            return

        print("Cleaning data...")

        # Remove duplicates
        initial_shape = self.data.shape
        self.data = self.data.drop_duplicates()
        print(f"Removed {initial_shape[0] - self.data.shape[0]} duplicate rows")

        # Handle missing values
        missing_values = self.data.isnull().sum()
        if missing_values.sum() > 0:
            print(f"Missing values:\\n{missing_values[missing_values > 0]}")

            # Fill numeric columns with median
            numeric_columns = self.data.select_dtypes(include=[np.number]).columns
            for col in numeric_columns:
                if self.data[col].isnull().sum() > 0:
                    median_value = self.data[col].median()
                    self.data[col].fillna(median_value, inplace=True)

            # Fill categorical columns with mode
            categorical_columns = self.data.select_dtypes(include=['object']).columns
            for col in categorical_columns:
                if self.data[col].isnull().sum() > 0:
                    mode_value = self.data[col].mode().iloc[0] if not self.data[col].mode().empty else 'Unknown'
                    self.data[col].fillna(mode_value, inplace=True)

        # Convert data types if needed
        self._convert_data_types()

        print(f"Data cleaning completed. Final shape: {self.data.shape}")

    def _convert_data_types(self):
        """Convert columns to appropriate data types"""
        for col in self.data.columns:
            if 'date' in col.lower():
                try:
                    self.data[col] = pd.to_datetime(self.data[col])
                except:
                    pass
            elif self.data[col].dtype == 'object':
                # Try to convert to numeric
                try:
                    pd.to_numeric(self.data[col])
                    self.data[col] = pd.to_numeric(self.data[col])
                except:
                    pass

    def analyze_data(self):
        """Perform comprehensive data analysis"""
        if self.data is None:
            print("No data loaded")
            return

        print("Performing data analysis...")

        analysis_results = {
            'basic_stats': self._get_basic_stats(),
            'correlation': self._get_correlation_analysis(),
            'distribution': self._get_distribution_analysis(),
            'outliers': self._detect_outliers()
        }

        self.results = analysis_results
        return analysis_results

    def _get_basic_stats(self):
        """Get basic statistical information"""
        return {
            'shape': self.data.shape,
            'columns': list(self.data.columns),
            'dtypes': self.data.dtypes.to_dict(),
            'summary': self.data.describe().to_dict()
        }

    def _get_correlation_analysis(self):
        """Analyze correlations between numeric columns"""
        numeric_data = self.data.select_dtypes(include=[np.number])

        if numeric_data.shape[1] < 2:
            return "Not enough numeric columns for correlation analysis"

        correlation_matrix = numeric_data.corr()

        # Find highly correlated pairs
        high_corr_pairs = []
        for i in range(len(correlation_matrix.columns)):
            for j in range(i+1, len(correlation_matrix.columns)):
                corr_value = correlation_matrix.iloc[i, j]
                if abs(corr_value) > 0.7:
                    high_corr_pairs.append({
                        'columns': [correlation_matrix.columns[i], correlation_matrix.columns[j]],
                        'correlation': corr_value
                    })

        return {
            'correlation_matrix': correlation_matrix.to_dict(),
            'high_correlations': high_corr_pairs
        }

    def _get_distribution_analysis(self):
        """Analyze data distributions"""
        numeric_data = self.data.select_dtypes(include=[np.number])

        distributions = {}
        for col in numeric_data.columns:
            distributions[col] = {
                'mean': float(numeric_data[col].mean()),
                'median': float(numeric_data[col].median()),
                'std': float(numeric_data[col].std()),
                'skewness': float(numeric_data[col].skew()),
                'kurtosis': float(numeric_data[col].kurtosis())
            }

        return distributions

    def _detect_outliers(self):
        """Detect outliers using IQR method"""
        numeric_data = self.data.select_dtypes(include=[np.number])

        outliers_info = {}
        for col in numeric_data.columns:
            Q1 = numeric_data[col].quantile(0.25)
            Q3 = numeric_data[col].quantile(0.75)
            IQR = Q3 - Q1

            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR

            outliers = numeric_data[(numeric_data[col] < lower_bound) | (numeric_data[col] > upper_bound)][col]

            outliers_info[col] = {
                'count': len(outliers),
                'percentage': (len(outliers) / len(numeric_data)) * 100,
                'bounds': {
                    'lower': float(lower_bound),
                    'upper': float(upper_bound)
                }
            }

        return outliers_info

    def create_visualizations(self, output_dir='visualizations'):
        """Create data visualizations"""
        if self.data is None:
            print("No data loaded")
            return

        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Set style
        plt.style.use('seaborn-v0_8')
        sns.set_palette("husl")

        numeric_data = self.data.select_dtypes(include=[np.number])

        # Correlation heatmap
        if numeric_data.shape[1] > 1:
            plt.figure(figsize=(10, 8))
            correlation_matrix = numeric_data.corr()
            sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
            plt.title('Correlation Heatmap')
            plt.tight_layout()
            plt.savefig(f'{output_dir}/correlation_heatmap.png', dpi=300, bbox_inches='tight')
            plt.close()

        # Distribution plots
        for col in numeric_data.columns[:6]:  # Limit to first 6 columns
            plt.figure(figsize=(10, 6))

            # Histogram with KDE
            sns.histplot(data=self.data, x=col, kde=True)
            plt.title(f'Distribution of {col}')
            plt.tight_layout()
            plt.savefig(f'{output_dir}/{col}_distribution.png', dpi=300, bbox_inches='tight')
            plt.close()

        # Box plots for outlier detection
        if len(numeric_data.columns) > 1:
            plt.figure(figsize=(12, 6))
            melted_data = numeric_data.melt()
            sns.boxplot(data=melted_data, x='variable', y='value')
            plt.xticks(rotation=45)
            plt.title('Box Plot - Outlier Detection')
            plt.tight_layout()
            plt.savefig(f'{output_dir}/box_plots.png', dpi=300, bbox_inches='tight')
            plt.close()

        print(f"Visualizations saved to {output_dir}/")

    def train_model(self, target_column, feature_columns=None):
        """Train a simple linear regression model"""
        if self.data is None:
            print("No data loaded")
            return

        if target_column not in self.data.columns:
            print(f"Target column '{target_column}' not found")
            return

        # Prepare features and target
        if feature_columns is None:
            feature_columns = [col for col in self.data.select_dtypes(include=[np.number]).columns
                             if col != target_column]

        X = self.data[feature_columns].fillna(self.data[feature_columns].median())
        y = self.data[target_column]

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train model
        self.model = LinearRegression()
        self.model.fit(X_train, y_train)

        # Make predictions
        y_pred = self.model.predict(X_test)

        # Calculate metrics
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        model_results = {
            'target_column': target_column,
            'feature_columns': feature_columns,
            'metrics': {
                'mse': mse,
                'r2_score': r2,
                'rmse': np.sqrt(mse)
            },
            'coefficients': dict(zip(feature_columns, self.model.coef_)),
            'intercept': float(self.model.intercept_)
        }

        self.results['model'] = model_results
        return model_results

    def save_results(self, output_file='analysis_results.json'):
        """Save analysis results to JSON file"""
        if not self.results:
            print("No results to save")
            return

        # Convert numpy types to native Python types
        def convert_to_serializable(obj):
            if isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                return float(obj)
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, pd.DataFrame):
                return obj.to_dict()
            elif isinstance(obj, pd.Series):
                return obj.to_dict()
            elif isinstance(obj, datetime):
                return obj.isoformat()
            return obj

        serializable_results = {}
        for key, value in self.results.items():
            if isinstance(value, dict):
                serializable_results[key] = {k: convert_to_serializable(v) for k, v in value.items()}
            else:
                serializable_results[key] = convert_to_serializable(value)

        with open(output_file, 'w') as f:
            json.dump(serializable_results, f, indent=2, default=str)

        print(f"Results saved to {output_file}")

    def generate_report(self):
        """Generate a comprehensive analysis report"""
        if not self.results:
            print("No analysis results available. Run analyze_data() first.")
            return

        report = f"""
DATA ANALYSIS REPORT
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

BASIC STATISTICS
================
Data Shape: {self.results.get('basic_stats', {}).get('shape', 'N/A')}
Columns: {len(self.results.get('basic_stats', {}).get('columns', []))}

CORRELATION ANALYSIS
===================
"""

        if 'correlation' in self.results:
            corr_data = self.results['correlation']
            if isinstance(corr_data, dict) and 'high_correlations' in corr_data:
                high_corr = corr_data['high_correlations']
                if high_corr:
                    report += "Highly correlated variable pairs:\\n"
                    for pair in high_corr:
                        report += f"  {pair['columns'][0]} ↔ {pair['columns'][1]}: {pair['correlation']:.3f}\\n"
                else:
                    report += "No highly correlated variable pairs found.\\n"

        report += f"""

DISTRIBUTION ANALYSIS
====================
Summary of numeric variables:
"""
        if 'distribution' in self.results:
            for var, stats in self.results['distribution'].items():
                report += f"{var}:\\n"
                report += f"  Mean: {stats['mean']:.2f}, Median: {stats['median']:.2f}, Std: {stats['std']:.2f}\\n"
                report += f"  Skewness: {stats['skewness']:.2f}, Kurtosis: {stats['kurtosis']:.2f}\\n\\n"

        report += f"""
OUTLIER ANALYSIS
================
"""
        if 'outliers' in self.results:
            for var, info in self.results['outliers'].items():
                report += f"{var}: {info['count']} outliers ({info['percentage']:.1f}%)\\n"

        if 'model' in self.results:
            model_results = self.results['model']
            report += f"""

MODEL RESULTS
=============
Target Variable: {model_results['target_column']}
Features: {', '.join(model_results['feature_columns'])}

Performance Metrics:
  MSE: {model_results['metrics']['mse']:.4f}
  RMSE: {model_results['metrics']['rmse']:.4f}
  R² Score: {model_results['metrics']['r2_score']:.4f}

Model Coefficients:
"""
            for feature, coef in model_results['coefficients'].items():
                report += f"  {feature}: {coef:.4f}\\n"

            report += f"\\nIntercept: {model_results['intercept']:.4f}\\n"

        return report

# Example usage
if __name__ == "__main__":
    # Initialize analyzer
    analyzer = DataAnalyzer()

    # For demonstration, create sample data
    sample_data = {
        'feature1': np.random.normal(50, 10, 1000),
        'feature2': np.random.normal(25, 5, 1000),
        'feature3': np.random.normal(75, 15, 1000),
        'target': np.random.normal(100, 20, 1000)
    }

    analyzer.data = pd.DataFrame(sample_data)

    # Perform analysis
    analyzer.clean_data()
    results = analyzer.analyze_data()
    analyzer.create_visualizations()
    analyzer.train_model('target')
    analyzer.save_results()

    # Generate and print report
    report = analyzer.generate_report()
    print(report)`,
          dependencies: ['pandas', 'numpy', 'matplotlib', 'seaborn', 'scikit-learn'],
          tags: ['data-analysis', 'pandas', 'matplotlib', 'machine-learning']
        }
      }
    },
    {
      id: 'java',
      name: 'Java',
      language: 'java',
      description: 'Object-oriented programming language for enterprise applications',
      icon: '☕',
      features: ['Object-oriented', 'Platform independent', 'Strong typing', 'Large ecosystem'],
      complexity: 'intermediate',
      popularity: 75,
      templates: {
        'spring-boot': {
          name: 'Spring Boot Application',
          description: 'REST API with Spring Boot and JPA',
          category: 'backend',
          code: `package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.*;
import java.util.List;
import java.time.LocalDateTime;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}

// Entity
@Entity
@Table(name = "users")
class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors, getters, setters
    public User() {}

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

// Repository
interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}

// Service
@Service
class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}

// Controller
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleRuntimeException(RuntimeException ex) {
        return new ErrorResponse(ex.getMessage());
    }
}

class ErrorResponse {
    private String message;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ErrorResponse(String message) {
        this.message = message;
    }

    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
}`,
          dependencies: ['spring-boot-starter-web', 'spring-boot-starter-data-jpa', 'h2'],
          tags: ['spring-boot', 'jpa', 'rest-api', 'java']
        }
      }
    },
    {
      id: 'csharp',
      name: 'C#',
      language: 'csharp',
      description: 'Modern object-oriented language for .NET development',
      icon: '🔷',
      features: ['Object-oriented', 'Type-safe', 'LINQ', 'Async/await'],
      complexity: 'intermediate',
      popularity: 70,
      templates: {
        'asp-net-core': {
          name: 'ASP.NET Core Web API',
          description: 'RESTful API with Entity Framework and dependency injection',
          category: 'backend',
          code: `using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddControllers();
            services.AddSwaggerGen();

            // CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("AllowAll");
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }

    // Models
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<Post> Posts { get; set; } = new List<Post>();
    }

    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int UserId { get; set; }
        public User User { get; set; }
    }

    // Database Context
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Username).HasMaxLength(50);
                entity.Property(e => e.Email).HasMaxLength(100);
            });

            modelBuilder.Entity<Post>(entity =>
            {
                entity.Property(e => e.Title).HasMaxLength(200);
                entity.HasOne(p => p.User)
                      .WithMany(u => u.Posts)
                      .HasForeignKey(p => p.UserId);
            });
        }
    }

    // Services
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User> CreateUserAsync(User user);
        Task<User> UpdateUserAsync(int id, User user);
        Task DeleteUserAsync(int id);
    }

    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.Include(u => u.Posts).ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.Include(u => u.Posts)
                                           .FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                throw new KeyNotFoundException($"User with id {id} not found");
            return user;
        }

        public async Task<User> CreateUserAsync(User user)
        {
            // Check for existing username/email
            if (await _context.Users.AnyAsync(u => u.Username == user.Username))
                throw new InvalidOperationException("Username already exists");

            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
                throw new InvalidOperationException("Email already exists");

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateUserAsync(int id, User user)
        {
            var existingUser = await GetUserByIdAsync(id);
            existingUser.Username = user.Username;
            existingUser.Email = user.Email;

            await _context.SaveChangesAsync();
            return existingUser;
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await GetUserByIdAsync(id);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }

    // Controllers
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                return Ok(user);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            try
            {
                var createdUser = await _userService.CreateUserAsync(user);
                return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            try
            {
                var updatedUser = await _userService.UpdateUserAsync(id, user);
                return Ok(updatedUser);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }

    // Exception Handling
    public class GlobalExceptionHandler : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/json";

                var errorResponse = new
                {
                    error = "Internal server error",
                    message = ex.Message,
                    timestamp = DateTime.UtcNow
                };

                await context.Response.WriteAsJsonAsync(errorResponse);
            }
        }
    }
}`,
          dependencies: ['Microsoft.AspNetCore.App', 'Microsoft.EntityFrameworkCore.SqlServer', 'Swashbuckle.AspNetCore'],
          tags: ['asp-net-core', 'entity-framework', 'web-api', 'csharp']
        }
      }
    },
    {
      id: 'php',
      name: 'PHP',
      language: 'php',
      description: 'Server-side scripting language for web development',
      icon: '🐘',
      features: ['Easy to learn', 'Web-focused', 'Large ecosystem', 'Flexible syntax'],
      complexity: 'beginner',
      popularity: 65,
      templates: {
        'laravel-app': {
          name: 'Laravel Application',
          description: 'Full-stack application with Laravel and Eloquent ORM',
          category: 'web',
          code: `<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class User extends Model
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function getAvatarUrlAttribute(): string
    {
        return $this->avatar
            ? asset('storage/avatars/' . $this->avatar)
            : "https://ui-avatars.com/api/?name=" . urlencode($this->name) . "&color=7F9CF5&background=EBF4FF";
    }
}

class Post extends Model
{
    protected $fillable = [
        'title',
        'content',
        'user_id',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at');
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}

class Comment extends Model
{
    protected $fillable = [
        'content',
        'user_id',
        'post_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class APIController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'user' => $user,
            'token' => $user->createToken('API Token')->plainTextToken
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'user' => $user,
            'token' => $user->createToken('API Token')->plainTextToken
        ]);
    }

    public function getUsers(): JsonResponse
    {
        $users = User::with('posts')->paginate(15);

        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    }

    public function getUser(int $id): JsonResponse
    {
        $user = User::with(['posts.comments'])->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    public function createPost(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'post' => $post->load('user')
        ], 201);
    }

    public function getPosts(): JsonResponse
    {
        $posts = Post::with(['user', 'comments.user'])
                     ->published()
                     ->recent()
                     ->paginate(10);

        return response()->json([
            'success' => true,
            'posts' => $posts
        ]);
    }

    public function getPost(int $id): JsonResponse
    {
        $post = Post::with(['user', 'comments.user'])->find($id);

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Post not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'post' => $post
        ]);
    }

    public function addComment(Request $request, int $postId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $comment = Comment::create([
            'content' => $request->content,
            'user_id' => auth()->id(),
            'post_id' => $postId,
        ]);

        return response()->json([
            'success' => true,
            'comment' => $comment->load('user')
        ], 201);
    }
}

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\APIController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group.
|
*/

Route::post('/register', [APIController::class, 'register']);
Route::post('/login', [APIController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [APIController::class, 'getUsers']);
    Route::get('/users/{id}', [APIController::class, 'getUser']);

    Route::post('/posts', [APIController::class, 'createPost']);
    Route::get('/posts', [APIController::class, 'getPosts']);
    Route::get('/posts/{id}', [APIController::class, 'getPost']);

    Route::post('/posts/{postId}/comments', [APIController::class, 'addComment']);
});`,
          dependencies: ['laravel/framework', 'laravel/sanctum'],
          tags: ['laravel', 'php', 'eloquent', 'api']
        }
      }
    }
  ]

  static async generateCode(prompt: string, options: GenerationOptions): Promise<string> {
    const { language, framework, template, features, style } = options

    // Find the language template
    const languageTemplate = this.languages.find(lang => lang.language === language)
    if (!languageTemplate) {
      throw new Error(`Unsupported language: ${language}`)
    }

    let generatedCode = ''

    // If a specific template is requested
    if (template && languageTemplate.templates[template]) {
      generatedCode = languageTemplate.templates[template].code
    } else {
      // Generate code based on the prompt and features
      generatedCode = await this.generateFromPrompt(prompt, language, framework, features, style)
    }

    // Apply code formatting and cleanup
    generatedCode = this.formatCode(generatedCode, language)

    // Add comments and documentation if requested
    if (options.documentation) {
      generatedCode = this.addDocumentation(generatedCode, language, prompt)
    }

    return generatedCode
  }

  private static async generateFromPrompt(
    prompt: string,
    language: string,
    framework: string | undefined,
    features: string[] = [],
    style: string = 'standard'
  ): Promise<string> {
    // This would integrate with an AI service in a real implementation
    // For now, return a basic template based on language and framework

    const baseTemplates: Record<string, string> = {
      'javascript': `// ${prompt}
// Generated by Codiner AI

class Application {
  constructor() {
    this.initialize()
  }

  initialize() {
    console.log('Application initialized')
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Add event listeners here
  }
}

// Initialize the application
const app = new Application()

export default app`,

      'typescript': `// ${prompt}
// Generated by Codiner AI

interface Config {
  apiUrl: string
  debug: boolean
  features: string[]
}

class Application {
  private config: Config

  constructor(config: Config) {
    this.config = config
    this.initialize()
  }

  private initialize(): void {
    console.log('Application initialized with config:', this.config)
    this.setupServices()
  }

  private setupServices(): void {
    // Initialize services here
  }

  public getConfig(): Config {
    return this.config
  }
}

// Default configuration
const defaultConfig: Config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  debug: process.env.NODE_ENV === 'development',
  features: ['logging', 'analytics', 'error-tracking']
}

// Initialize the application
const app = new Application(defaultConfig)

export default app
export type { Config }`,

      'python': `# ${prompt}
# Generated by Codiner AI

import os
import logging
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class Config:
    """Application configuration"""
    debug: bool = False
    database_url: Optional[str] = None
    api_key: Optional[str] = None
    features: List[str] = None

    def __post_init__(self):
        if self.features is None:
            self.features = ['logging', 'caching']

class Application:
    """Main application class"""

    def __init__(self, config: Optional[Config] = None):
        self.config = config or Config()
        self.services = {}
        self._initialized = False
        logger.info("Application instance created")

    def initialize(self) -> None:
        """Initialize the application"""
        if self._initialized:
            logger.warning("Application already initialized")
            return

        try:
            logger.info("Initializing application...")
            self._setup_services()
            self._load_configuration()
            self._initialized = True
            logger.info("Application initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize application: {e}")
            raise

    def _setup_services(self) -> None:
        """Setup application services"""
        # Setup services based on configuration
        if 'logging' in self.config.features:
            self.services['logger'] = logger

        if 'caching' in self.config.features:
            self.services['cache'] = {}

        logger.debug("Services setup completed")

    def _load_configuration(self) -> None:
        """Load configuration from environment"""
        self.config.debug = os.getenv('DEBUG', 'false').lower() == 'true'
        self.config.database_url = os.getenv('DATABASE_URL')
        self.config.api_key = os.getenv('API_KEY')

        logger.debug("Configuration loaded")

    def run(self) -> None:
        """Run the application"""
        if not self._initialized:
            raise RuntimeError("Application not initialized. Call initialize() first.")

        logger.info("Starting application...")
        try:
            while True:
                # Main application loop
                self._process_tasks()
        except KeyboardInterrupt:
            logger.info("Application stopped by user")
        except Exception as e:
            logger.error(f"Application error: {e}")
            raise

    def _process_tasks(self) -> None:
        """Process application tasks"""
        # Implement task processing logic here
        pass

    def get_status(self) -> Dict[str, Any]:
        """Get application status"""
        return {
            'initialized': self._initialized,
            'config': {
                'debug': self.config.debug,
                'features': self.config.features,
                'services_count': len(self.services)
            },
            'timestamp': datetime.utcnow().isoformat()
        }

def main():
    """Main entry point"""
    config = Config(
        debug=os.getenv('DEBUG', 'false').lower() == 'true'
    )

    app = Application(config)
    app.initialize()

    # Print status
    status = app.get_status()
    print("Application Status:")
    for key, value in status.items():
        print(f"  {key}: {value}")

    return app

if __name__ == "__main__":
    app = main()`
    }

    return baseTemplates[language] || `// Generated code for ${language}\n// ${prompt}`
  }

  private static formatCode(code: string, language: string): string {
    // Basic code formatting (in a real implementation, this would use proper formatters)
    switch (language) {
      case 'javascript':
      case 'typescript':
        return this.formatJavaScript(code)
      case 'python':
        return this.formatPython(code)
      case 'java':
        return this.formatJava(code)
      case 'csharp':
        return this.formatCSharp(code)
      case 'php':
        return this.formatPHP(code)
      default:
        return code
    }
  }

  private static formatJavaScript(code: string): string {
    // Basic JS formatting
    return code
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
  }

  private static formatPython(code: string): string {
    // Basic Python formatting
    return code
  }

  private static formatJava(code: string): string {
    // Basic Java formatting
    return code
  }

  private static formatCSharp(code: string): string {
    // Basic C# formatting
    return code
  }

  private static formatPHP(code: string): string {
    // Basic PHP formatting
    return code
  }

  private static addDocumentation(code: string, language: string, prompt: string): string {
    const header = this.generateDocumentationHeader(language, prompt)
    return header + '\n\n' + code
  }

  private static generateDocumentationHeader(language: string, prompt: string): string {
    const timestamp = new Date().toISOString()

    switch (language) {
      case 'javascript':
      case 'typescript':
        return `/**
 * ${prompt}
 *
 * Generated by Codiner AI
 * Timestamp: ${timestamp}
 *
 * This code was automatically generated based on your requirements.
 * Please review and test thoroughly before deploying to production.
 */`
      case 'python':
        return `"""
${prompt}

Generated by Codiner AI
Timestamp: ${timestamp}

This code was automatically generated based on your requirements.
Please review and test thoroughly before deploying to production.
"""`

      case 'java':
        return `/**
 * ${prompt}
 *
 * Generated by Codiner AI
 * Timestamp: ${timestamp}
 *
 * This code was automatically generated based on your requirements.
 * Please review and test thoroughly before deploying to production.
 */`

      case 'csharp':
        return `/// <summary>
/// ${prompt}
///
/// Generated by Codiner AI
/// Timestamp: ${timestamp}
///
/// This code was automatically generated based on your requirements.
/// Please review and test thoroughly before deploying to production.
/// </summary>`

      case 'php':
        return `/**
 * ${prompt}
 *
 * Generated by Codiner AI
 * Timestamp: ${timestamp}
 *
 * This code was automatically generated based on your requirements.
 * Please review and test thoroughly before deploying to production.
 */`

      default:
        return `# ${prompt}\n# Generated by Codiner AI\n# Timestamp: ${timestamp}`
    }
  }

  static getSupportedLanguages(): LanguageTemplate[] {
    return this.languages
  }

  static getLanguageById(id: string): LanguageTemplate | undefined {
    return this.languages.find(lang => lang.id === id)
  }

  static getTemplatesForLanguage(language: string): CodeTemplate[] {
    const langTemplate = this.languages.find(lang => lang.language === language)
    return langTemplate ? Object.values(langTemplate.templates) : []
  }

  static getTemplate(language: string, templateId: string): CodeTemplate | undefined {
    const langTemplate = this.languages.find(lang => lang.language === language)
    return langTemplate?.templates[templateId]
  }
}
