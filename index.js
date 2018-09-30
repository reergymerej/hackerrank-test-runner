#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawnSync

function log () {
  if (process.env.DEBUG) {
    const args = Array.prototype.slice.apply(arguments)
    console.log.apply(console.log, args)
  }
}

const testSolution = (solutionPath) => {
  log('solutionPath', solutionPath)
  // find test dir
  const getTestDir = (solutionPath) => {
    return path.join(path.dirname(solutionPath), 'tests')
  }

  const testDirPath = getTestDir(solutionPath)
  log('testDirPath', testDirPath)
  // TODO: handle missing

  const outputPath = path.resolve(path.dirname(testDirPath), 'out.txt')
  log('outputPath', outputPath)

  // find inputs
  const inputRegex = (/^input(\d+)\.txt$/)
  const inputsDir = path.resolve(testDirPath, 'input')
  const inputs = fs.readdirSync(inputsDir)
    .filter(x => inputRegex.test(x))
    .map(x => path.resolve(inputsDir, x))
  log('inputs', inputs)

  // for each input, find output
  const outputsDir = path.resolve(testDirPath, 'output')
  const outputs = inputs.map(x => {
    const name = path.basename(x)
    const num = inputRegex.exec(name)[1]
    return path.resolve(outputsDir, `output${num}.txt`)
  })
  log('outputs', outputs)

  // run tests
  const runTest = (solution, input, output) => {
    log('runTest', solution)

    const args = [
      solution,
    ]

    const inputData = fs.readFileSync(input, 'utf8')
    log('inputData', inputData)

    const options = {
      input: inputData,
      env: Object.assign({}, process.env, {
        OUTPUT_PATH: outputPath,
      }),
    }

    const result = spawn('node', args, options)
    log('status', result.status)
    const stdout = result.stdout.toString('utf8')
    if (stdout) {
      process.stdout.write(stdout)
    }

    if (result.error) {
      log('error', result.error)
      throw result.error
    }

    const errorString = result.stderr && result.stderr.toString('utf8')
    if (errorString) {
      log('error', errorString)
      throw new Error(errorString)
    }

    // If everything was fine, compare result to expected.
    // TODO: cache input/output files
    const expected = fs.readFileSync(output, 'utf8').trim()
    const actual = fs.readFileSync(outputPath, 'utf8').trim()

    if (expected !== actual) {
      throw new Error(`expected ${actual} to be ${expected}`)
    }
  }

  let failed = 0
  inputs.forEach((x, i) => {
    try {
      runTest(solutionPath, x, outputs[i])
    } catch (error) {
      console.log(`failed ${x}`)
      console.log(error.message)
      failed++
    }
  })

  try {
    fs.unlinkSync(outputPath)
  } catch (err) { }

  console.log(`passed ${inputs.length - failed}/${inputs.length} test cases`)
}

const api = {
  test: testSolution,
}

if (require.main === module) {
  const cwd = process.cwd()
  const solution = process.argv[2]
  const solutionPath = path.resolve(cwd, solution)
  // TODO: handle missing
  testSolution(solutionPath)

} else {
  module.exports = api
}
