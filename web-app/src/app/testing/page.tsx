"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Play,
  Square,
  CheckCircle,
  XCircle,
  AlertTriangle,
  SkipForward,
  Clock,
  TrendingUp,
  BarChart3,
  Code,
  Zap,
  Target,
  RefreshCw,
  Download,
  Upload,
  Settings,
  FileText,
  Layers,
  TestTube,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TestRunner, type TestSuite, type TestResult, type TestOptions } from "@/lib/test-runner"

export default function TestingPage() {
  const [code, setCode] = useState(`function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

class Calculator {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }
}

// Example usage
const calc = new Calculator();
console.log(calc.add(5, 3)); // Should output 8
console.log(calc.multiply(4, 2)); // Should output 8
console.log(calc.divide(10, 2)); // Should output 5`)
  const [language, setLanguage] = useState('javascript')
  const [framework, setFramework] = useState('')
  const [testType, setTestType] = useState<'unit' | 'integration' | 'e2e' | 'performance' | 'all'>('all')
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('code')
  const { toast } = useToast()

  const runTests = async () => {
    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please provide code to test",
        variant: "destructive",
      })
      return
    }

    setIsRunning(true)
    setTestSuite(null)

    try {
      const options: TestOptions = {
        language,
        framework: framework || undefined,
        code,
        testType,
        timeout: 30000,
        coverage: true
      }

      const suite = await TestRunner.runTests(options)
      setTestSuite(suite)

      const passedTests = suite.summary.passed
      const totalTests = suite.summary.total

      if (passedTests === totalTests) {
        toast({
          title: "All Tests Passed! 🎉",
          description: `${passedTests}/${totalTests} tests passed successfully`,
        })
      } else {
        toast({
          title: "Tests Completed",
          description: `${passedTests}/${totalTests} tests passed, ${totalTests - passedTests} failed`,
          variant: passedTests === 0 ? "destructive" : "default",
        })
      }
    } catch (error: any) {
      toast({
        title: "Test Error",
        description: error.message || "Failed to run tests",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const getTestProgress = () => {
    if (!testSuite) return 0
    return (testSuite.summary.passed / testSuite.summary.total) * 100
  }

  const getTestStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'error': return 'text-orange-600'
      case 'skipped': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getTestStatusBg = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return 'bg-green-50 dark:bg-green-900/20'
      case 'failed': return 'bg-red-50 dark:bg-red-900/20'
      case 'error': return 'bg-orange-50 dark:bg-orange-900/20'
      case 'skipped': return 'bg-yellow-50 dark:bg-yellow-900/20'
      default: return 'bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const sampleCodes = {
    javascript: `function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

class Calculator {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }
}

// Example usage
const calc = new Calculator();
console.log(calc.add(5, 3)); // Should output 8`,
    python: `def add(a, b):
    """Add two numbers together"""
    return a + b

def multiply(a, b):
    """Multiply two numbers"""
    return a * b

def divide(a, b):
    """Divide a by b with error handling"""
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

class Calculator:
    """A simple calculator class"""

    def __init__(self):
        self.operations = 0

    def add(self, a, b):
        self.operations += 1
        return a + b

    def multiply(self, a, b):
        self.operations += 1
        return a * b

    def divide(self, a, b):
        self.operations += 1
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b

# Example usage
if __name__ == "__main__":
    calc = Calculator()
    print(f"5 + 3 = {calc.add(5, 3)}")
    print(f"4 * 2 = {calc.multiply(4, 2)}")`,
    java: `public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }

    public int multiply(int a, int b) {
        return a * b;
    }

    public double divide(int a, int b) {
        if (b == 0) {
            throw new IllegalArgumentException("Cannot divide by zero");
        }
        return (double) a / b;
    }

    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println("5 + 3 = " + calc.add(5, 3));
        System.out.println("4 * 2 = " + calc.multiply(4, 2));
        System.out.println("10 / 2 = " + calc.divide(10, 2));
    }
}`,
    csharp: `using System;

namespace CalculatorApp
{
    public class Calculator
    {
        public int Add(int a, int b)
        {
            return a + b;
        }

        public int Multiply(int a, int b)
        {
            return a * b;
        }

        public double Divide(int a, int b)
        {
            if (b == 0)
            {
                throw new ArgumentException("Cannot divide by zero");
            }
            return (double)a / b;
        }

        static void Main(string[] args)
        {
            Calculator calc = new Calculator();
            Console.WriteLine($"5 + 3 = {calc.Add(5, 3)}");
            Console.WriteLine($"4 * 2 = {calc.Multiply(4, 2)}");
            Console.WriteLine($"10 / 2 = {calc.Divide(10, 2)}");
        }
    }
}`,
    php: `<?php

class Calculator {
    public function add($a, $b) {
        return $a + $b;
    }

    public function multiply($a, $b) {
        return $a * $b;
    }

    public function divide($a, $b) {
        if ($b == 0) {
            throw new InvalidArgumentException("Cannot divide by zero");
        }
        return $a / $b;
    }
}

// Example usage
$calc = new Calculator();
echo "5 + 3 = " . $calc->add(5, 3) . PHP_EOL;
echo "4 * 2 = " . $calc->multiply(4, 2) . PHP_EOL;
echo "10 / 2 = " . $calc->divide(10, 2) . PHP_EOL;

?>`
  }

  const loadSampleCode = (lang: string) => {
    setLanguage(lang)
    setCode(sampleCodes[lang as keyof typeof sampleCodes] || '')
  }

  return (
    <div className="min-h-screen space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <TestTube className="w-8 h-8 mr-3 text-blue-500" />
            Automated Testing
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Run comprehensive tests on your code to ensure quality and reliability
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Target className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
          <Button variant="outline" onClick={() => setActiveTab('results')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Results
          </Button>
        </div>
      </div>

      {/* Test Configuration */}
      <Card className="card-hover glass">
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
          <CardDescription>
            Configure your testing environment and parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Framework</label>
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue.js</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="express">Express.js</SelectItem>
                  <SelectItem value="django">Django</SelectItem>
                  <SelectItem value="spring">Spring Boot</SelectItem>
                  <SelectItem value="laravel">Laravel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Test Type</label>
              <Select value={testType} onValueChange={(value: any) => setTestType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tests</SelectItem>
                  <SelectItem value="unit">Unit Tests</SelectItem>
                  <SelectItem value="integration">Integration Tests</SelectItem>
                  <SelectItem value="performance">Performance Tests</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={runTests}
                disabled={isRunning || !code.trim()}
                className="w-full btn-gradient"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Tests
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-white/50 backdrop-blur-sm border border-white/20">
          <TabsTrigger value="code" className="text-sm font-medium">
            <Code className="w-4 h-4 mr-2" />
            Code Input
          </TabsTrigger>
          <TabsTrigger value="results" className="text-sm font-medium">
            <BarChart3 className="w-4 h-4 mr-2" />
            Test Results
          </TabsTrigger>
          <TabsTrigger value="samples" className="text-sm font-medium">
            <FileText className="w-4 h-4 mr-2" />
            Sample Code
          </TabsTrigger>
        </TabsList>

        {/* Code Input */}
        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code to Test</CardTitle>
              <CardDescription>
                Paste or write the code you want to test
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Enter your ${language} code here...`}
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Results */}
        <TabsContent value="results" className="space-y-6">
          {testSuite ? (
            <>
              {/* Test Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="card-hover glass text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {testSuite.summary.total}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Tests</p>
                  </CardContent>
                </Card>

                <Card className="card-hover glass text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {testSuite.summary.passed}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Passed</p>
                  </CardContent>
                </Card>

                <Card className="card-hover glass text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {testSuite.summary.failed}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Failed</p>
                  </CardContent>
                </Card>

                <Card className="card-hover glass text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {Math.round(getTestProgress())}%
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Success Rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Bar */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Test Progress</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {testSuite.summary.passed}/{testSuite.summary.total} tests passed
                    </span>
                  </div>
                  <Progress value={getTestProgress()} className="h-3" />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span>Duration: {testSuite.summary.duration}ms</span>
                    {testSuite.summary.coverage && (
                      <span>Coverage: {testSuite.summary.coverage}%</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Individual Test Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Test Details</CardTitle>
                  <CardDescription>
                    Detailed results for each test
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {testSuite.tests.map((test) => (
                        <div
                          key={test.id}
                          className={`p-4 rounded-lg border ${getTestStatusBg(test.status)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{TestRunner.getTestStatusIcon(test.status)}</span>
                              <h4 className="font-semibold text-slate-900 dark:text-white">
                                {test.name}
                              </h4>
                              <Badge className={getTestStatusColor(test.status)}>
                                {test.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                              <Clock className="w-4 h-4" />
                              <span>{test.duration}ms</span>
                            </div>
                          </div>

                          <p className="text-slate-600 dark:text-slate-400 mb-3">
                            {test.description}
                          </p>

                          {test.error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 mb-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-900 dark:text-red-100">
                                  Error
                                </span>
                              </div>
                              <p className="text-sm text-red-800 dark:text-red-200">
                                {test.error}
                              </p>
                            </div>
                          )}

                          {test.assertions.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-slate-900 dark:text-white">
                                Assertions ({test.assertions.length})
                              </h5>
                              {test.assertions.map((assertion, index) => (
                                <div key={index} className="flex items-start space-x-2 text-sm">
                                  {assertion.passed ? (
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  )}
                                  <div className="flex-1">
                                    <span className={assertion.passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                                      {assertion.description}
                                    </span>
                                    {assertion.error && (
                                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                        {assertion.error}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    No Test Results
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Run tests to see detailed results and analysis
                  </p>
                  <Button onClick={() => setActiveTab('code')}>
                    Go to Code Input
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Sample Code */}
        <TabsContent value="samples" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(sampleCodes).map(([lang, sampleCode]) => (
              <Card key={lang} className="card-hover glass cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="capitalize text-lg group-hover:text-blue-600 transition-colors">
                      {lang} Sample
                    </CardTitle>
                    <Badge variant="outline" className="capitalize">
                      {lang}
                    </Badge>
                  </div>
                  <CardDescription>
                    Example code with common patterns and best practices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32 mb-4">
                    <pre className="text-xs font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded text-slate-800 dark:text-slate-200">
                      {sampleCode.split('\n').slice(0, 10).join('\n')}
                      {sampleCode.split('\n').length > 10 && '\n...'}
                    </pre>
                  </ScrollArea>
                  <Button
                    onClick={() => loadSampleCode(lang)}
                    className="w-full"
                    size="sm"
                  >
                    Load Sample
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
