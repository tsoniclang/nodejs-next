import { attributes as A } from "@tsonic/core/lang.js";
import { Assert, FactAttribute } from "xunit-types/Xunit.js";
import { Environment } from "@tsonic/dotnet/System.js";

import { process } from "@tsonic/nodejs/process.js";

export class ProcessPidTests {
  public pid_matches_environment_process_id(): void {
    Assert.True(process.pid > 0);
    Assert.Equal(Environment.ProcessId, process.pid);
  }

  public ppid_is_non_negative_and_differs_when_available(): void {
    Assert.True(process.ppid >= 0);
    if (process.ppid > 0) {
      Assert.True(process.ppid !== process.pid);
    }
  }
}

A.on(ProcessPidTests)
  .method((t) => t.pid_matches_environment_process_id)
  .add(FactAttribute);
A.on(ProcessPidTests)
  .method((t) => t.ppid_is_non_negative_and_differs_when_available)
  .add(FactAttribute);
