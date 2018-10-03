  #!/usr/bin/env bash

  curl -X POST -H 'Content-type: application/json' --data '{"text":"Build process completed, should be getting a hockeyapp email soon.\nGit Commit: '"$(git log -1 --pretty=%B)"' - '"$(git log --pretty=format:'%H' -n 1)"'"}' https://hooks.slack.com/services/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