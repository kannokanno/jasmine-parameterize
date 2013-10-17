# Add files and commands to this file, like the example:
#   watch(%r{file/path}) { `command(s)` }
#
guard 'shell' do
  watch(%r{spec/.+_spec\.js$}) {|m| `phantomjs run-jasmine.js SpecRunner.html` }
  watch(%r{main/.+\.js$}) {|m| `phantomjs run-jasmine.js SpecRunner.html` }
end

