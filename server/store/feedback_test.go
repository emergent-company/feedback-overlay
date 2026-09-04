package store

import (
	"reflect"
	"testing"
)

func TestSplitCSV(t *testing.T) {
	if got := splitCSV(""); got != nil {
		t.Fatalf("empty = %v, want nil", got)
	}
	if got := splitCSV("1,2,3"); !reflect.DeepEqual(got, []string{"1", "2", "3"}) {
		t.Fatalf("splitCSV(1,2,3) = %v", got)
	}
	if got := splitCSV("42"); !reflect.DeepEqual(got, []string{"42"}) {
		t.Fatalf("splitCSV(42) = %v", got)
	}
}
