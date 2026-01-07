"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shuffle,
  Code,
  Zap,
  TrendingUp,
  Shield,
  BarChart3,
  Lightbulb,
  Target,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RefactoringPanel } from "@/components/refactoring/RefactoringPanel"

export default function RefactorPage() {
  const [code, setCode] = useState(`function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

function processUserData(users) {
  var result = [];
  for (var i = 0; i < users.length; i++) {
    if (users[i].age > 18) {
      result.push({
        name: users[i].name,
        age: users[i].age
      });
    }
  }
  return result;
}

// Example usage
var items = [
  { name: 'Item 1', price: 10 },
  { name: 'Item 2', price: 20 }
];

var users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 17 },
  { name: 'Charlie', age: 30 }
];

console.log('Total:', calculateTotal(items));
console.log('Adults:', processUserData(users));`)
  const [language, setLanguage] = useState('javascript')
  const { toast } = useToast()

  const sampleCodes = {
    javascript: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

function processUserData(users) {
  var result = [];
  for (var i = 0; i < users.length; i++) {
    if (users[i].age > 18) {
      result.push({
        name: users[i].name,
        age: users[i].age
      });
    }
  }
  return result;
}`,
    python: `def calculate_fibonacci(n):
    if n <= 1:
        return n
    else:
        return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

def process_list(items):
    result = []
    for item in items:
        if item > 10:
            result.append(item * 2)
    return result

# Inefficient string concatenation
def build_message(names):
    message = ""
    for name in names:
        message += f"Hello {name}! "
    return message

# Using old-style string formatting
def format_user_info(user):
    return "User: %s, Age: %d" % (user['name'], user['age'])`,
    java: `public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }

    public String processList(List<String> items) {
        StringBuilder result = new StringBuilder();
        for (String item : items) {
            result.append(item.toUpperCase());
            result.append(" ");
        }
        return result.toString().trim();
    }

    public void printUserInfo(User user) {
        System.out.println("Name: " + user.getName());
        System.out.println("Age: " + user.getAge());
        System.out.println("Email: " + user.getEmail());
    }
}`,
    csharp: `using System;
using System.Collections.Generic;

namespace MyApp
{
    public class DataProcessor
    {
        public List<int> ProcessNumbers(List<int> numbers)
        {
            var result = new List<int>();
            foreach (var number in numbers)
            {
                if (number > 5)
                {
                    result.Add(number * 2);
                }
            }
            return result;
        }

        public string BuildMessage(List<string> names)
        {
            string message = "";
            foreach (var name in names)
            {
                message += "Hello " + name + "! ";
            }
            return message.Trim();
        }
    }
}`
  }

  const loadSampleCode = (lang: string) => {
    setLanguage(lang)
    setCode(sampleCodes[lang as keyof typeof sampleCodes] || '')
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    toast({
      title: "Code Updated",
      description: "Refactored code has been applied",
    })
  }

  return (
    <div className="min-h-screen space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <Shuffle className="w-8 h-8 mr-3 text-purple-500" />
            AI Code Refactoring
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Get intelligent suggestions to improve your code quality, performance, and maintainability
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              <Target className="w-8 h-8 mx-auto mb-2" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Performance</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              <Shield className="w-8 h-8 mx-auto mb-2" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Security</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              <Code className="w-8 h-8 mx-auto mb-2" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Maintainability</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              <Lightbulb className="w-8 h-8 mx-auto mb-2" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Readability</p>
          </CardContent>
        </Card>
      </div>

      {/* Sample Code Selector */}
      <Card className="card-hover glass">
        <CardHeader>
          <CardTitle>Sample Code</CardTitle>
          <CardDescription>
            Try refactoring with these sample code snippets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(sampleCodes).map((lang) => (
              <Button
                key={lang}
                variant={language === lang ? "default" : "outline"}
                onClick={() => loadSampleCode(lang)}
                className="capitalize"
              >
                {lang}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Code Input */}
      <Card className="card-hover glass">
        <CardHeader>
          <CardTitle>Code to Refactor</CardTitle>
          <CardDescription>
            Paste or write the code you want to analyze and refactor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Enter your ${language} code here...`}
            rows={15}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>

      {/* Refactoring Panel */}
      <RefactoringPanel
        code={code}
        language={language}
        onCodeChange={handleCodeChange}
      />

      {/* Benefits Section */}
      <Card className="card-hover glass">
        <CardHeader>
          <CardTitle>Refactoring Benefits</CardTitle>
          <CardDescription>
            What you gain from AI-powered code refactoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Performance Improvements</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Optimize algorithms, reduce complexity, and improve execution speed
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Security Enhancements</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Identify and fix security vulnerabilities and unsafe practices
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <BarChart3 className="w-5 h-5 text-purple-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Better Maintainability</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Improve code organization, reduce technical debt, and ease future changes
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-orange-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Enhanced Readability</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Make code more understandable and easier for teams to work with
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
